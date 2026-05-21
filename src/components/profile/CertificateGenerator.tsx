import { useRef, useState } from "react";
import type { FC } from "react";
import { Download, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getSupabaseClient } from "../../lib/supabaseConfig";
import { issueCertificate } from "../../lib/certificates";
import type { CertificateRecord } from "../../lib/certificates";
import { trilhas } from "../../data/mock";

const LOGO_URL = "/logo-fci-192.webp";

interface CertificateGeneratorProps {
  userId: string;
  trailSlug: string;
  userName: string;
  courseName: string;
  completionDate: string;
  totalHours: string;
}

const CertificateGenerator: FC<CertificateGeneratorProps> = ({
  userId,
  trailSlug,
  userName,
  courseName,
  completionDate,
  totalHours,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [certificateCode, setCertificateCode] = useState<string | null>(null);
  const [certificateDetails, setCertificateDetails] =
    useState<Pick<CertificateRecord, "userName" | "courseName" | "completionDate" | "totalHours">>({
      userName,
      courseName,
      completionDate,
      totalHours,
    });

  const generatePDF = async () => {
    if (!certificateRef.current) return;
    const code =
      `CERT-${crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`;
    setLoading(true);

    try {
      // 1. Verificação remota de segurança (evita que burlem o localstorage)
      const supabase = await getSupabaseClient();
      if (!supabase) throw new Error("Erro de infraestrutura: Banco de dados indisponível.");
      
      const { data, error } = await supabase
        .from("module_progress")
        .select("module_id, completed")
        .eq("user_id", userId)
        .eq("trail_slug", trailSlug);

      if (error) {
        throw new Error("Erro ao validar certificado: " + error.message);
      }

      const requiredModules = trilhas.find(t => t.slug === trailSlug)?.modulos || [];
      const completedModuleIds = new Set((data || []).filter(d => d.completed).map(d => d.module_id));
      const isActuallyCompleted = requiredModules.length > 0 && requiredModules.every(mod => completedModuleIds.has(mod.id));

      if (!isActuallyCompleted) {
        alert("Ops! Parece que você ainda não completou 100% desta trilha.");
        return;
      }

      const issuedCertificate = await issueCertificate({
        code,
        trailSlug,
      });

      setCertificateCode(issuedCertificate.code);
      setCertificateDetails({
        userName: issuedCertificate.userName,
        courseName: issuedCertificate.courseName,
        completionDate: issuedCertificate.completionDate,
        totalHours: issuedCertificate.totalHours,
      });
      await new Promise(resolve => setTimeout(resolve, 100));

      // 2. Geração do PDF
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const element = certificateRef.current;
      // Tornar visível temporariamente para rampa de captura
      element.style.display = "block";

      const canvas = await html2canvas(element, {
        scale: 3, // Alta resolução
        useCORS: true,
      });

      // Esconder novamente
      element.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificado_MackSeguro_${issuedCertificate.courseName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar certificado", err);
    } finally {
      setLoading(false);
    }
  };

  const validationUrl =
  `https://mackseguro.com/certificados/${certificateCode}`;

  return (
    <>
      <button
        onClick={generatePDF}
        disabled={loading}
        className="btn-primary inline-flex items-center text-sm px-4 py-2"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Baixar Certificado
      </button>

      {/* CSS Escondido - Renderizado fora da tela mas não fixo/none no layout */}
      <div className="overflow-hidden w-0 h-0 absolute -z-50 left-[-9999px]">
        <div
          ref={certificateRef}
          className="relative w-[1122px] h-[793px] p-12"
          style={{
            backgroundColor: "#ffffff",
            color: "#1f2937",
            fontFamily: "sans-serif",
            display: "none",
            border: "20px solid #8F1413",
          }}
        >
          <div
            className="absolute top-12 left-12"
            style={{
              width: "140px",
              height: "140px",
            }}
          >
            <img
              src={LOGO_URL}
              alt="MackSeguro"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
            <h3
              className="text-2xl font-bold tracking-widest uppercase mb-4"
              style={{ color: "#8F1413" }}
            >
              Projeto de Extensão MackSeguro
            </h3>

            <h1
              className="text-6xl font-black mt-6 mb-12 uppercase"
              style={{ color: "#111827" }}
            >
              Certificado de Conclusão
            </h1>

            <p
              className="text-xl mb-4"
              style={{ color: "#4b5563" }}
            >
              Certificamos que
            </p>

            <h2
              className="text-4xl font-bold pb-2 mb-8 px-12"
              style={{
                color: "#1f2937",
                borderBottom: "2px solid #d1d5db",
              }}
            >
              {certificateDetails.userName}
            </h2>

            <div
              className="text-lg max-w-3xl mx-auto leading-relaxed mb-16"
              style={{ color: "#4b5563" }}
            >
              concluiu com êxito a trilha de conhecimento <strong>"{certificateDetails.courseName}"</strong>,
              com carga horária estimada de <strong>{certificateDetails.totalHours}</strong>,
              desenvolvendo competências e habilidades em Prevenção de Riscos Digitais
              para a família e sociedade.
            </div>

            <div
              className="flex justify-between w-full px-24 font-medium"
              style={{ color: "#6b7280" }}
            >
              <div className="text-center">
                <div
                  className="w-48 mb-2 mx-auto"
                  style={{ borderBottom: "1px solid #9ca3af" }}
                />

                <p>Data de Conclusão</p>

                <p
                  className="font-bold mt-1"
                  style={{ color: "#8F1413" }}
                >
                  {certificateDetails.completionDate}
                </p>
              </div>

              <div className="text-center">
                <div
                  className="w-48 mb-2 mx-auto"
                  style={{ borderBottom: "1px solid #9ca3af" }}
                />

                <p>Equipe MackSeguro</p>

                <p
                  className="font-bold mt-1"
                  style={{ color: "#8F1413" }}
                >
                  Coordenação
                </p>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-12 right-8 text-sm"
            style={{ color: "#6b7280" }}
          >
            Código de validação: {certificateCode ?? "--"}
          </div>

          <div
            className="absolute bottom-6 right-8 text-xs"
            style={{ color: "#9ca3af" }}
          >
            *Certificado emitido digitalmente pela plataforma. Válido sem assinatura.
          </div>

          <div className="absolute bottom-4 left-8 flex items-center gap-4">
            <QRCodeSVG
              value={validationUrl}
              size={80}
            />

            <div style={{ color: "#6b7280", fontSize: "12px" }}>
              <p>Validar certificado:</p>
              <p>{validationUrl}</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CertificateGenerator;
