import { useRef, useState } from "react";
import type { FC } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";
import { getSupabaseClient } from "../../lib/supabaseConfig";
import { trilhas } from "../../data/mock";

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

  const generatePDF = async () => {
    if (!certificateRef.current) return;
    setLoading(true);

    try {
      // 1. Verificação remota de segurança (evita que burlem o localstorage)
      const supabase = getSupabaseClient();
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
        setLoading(false);
        return;
      }

      // 2. Geração do PDF
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
      pdf.save(`Certificado_MackSeguro_${courseName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar certificado", err);
    } finally {
      setLoading(false);
    }
  };

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
          className="relative bg-white w-[1122px] h-[793px] p-12 text-gray-800"
          style={{
            fontFamily: "sans-serif",
            display: "none",
            border: "20px solid #8F1413", // Mack Red
          }}
        >
          <div className="absolute top-12 left-12 w-32 h-32 opacity-20">
            {/* Watermark logo or decoration */}
            <div className="w-full h-full bg-[#8F1413] rounded-full blur-3xl"></div>
          </div>
          
          <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
            <h3 className="text-2xl font-bold tracking-widest text-[#8F1413] uppercase mb-4">
              Projeto de Extensão MackSeguro
            </h3>
            
            <h1 className="text-6xl font-black text-gray-900 mt-6 mb-12 uppercase">
              Certificado de Conclusão
            </h1>

            <p className="text-xl text-gray-600 mb-4">
              Certificamos que
            </p>

            <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-8 px-12">
              {userName}
            </h2>

            <div className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-16">
              concluiu com êxito a trilha de conhecimento <strong>"{courseName}"</strong>, 
              com carga horária estimada de <strong>{totalHours}</strong>, 
              desenvolvendo competências e habilidades em Prevenção de Riscos Digitais 
              para a família e sociedade.
            </div>

            <div className="flex justify-between w-full px-24 font-medium text-gray-500">
              <div className="text-center">
                <div className="border-b border-gray-400 w-48 mb-2 mx-auto"></div>
                <p>Data de Conclusão</p>
                <p className="text-[#8F1413] font-bold mt-1">{completionDate}</p>
              </div>

              <div className="text-center">
                <div className="border-b border-gray-400 w-48 mb-2 mx-auto"></div>
                <p>Equipe MackSeguro</p>
                <p className="text-[#8F1413] font-bold mt-1">Coordenação</p>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-8 text-xs text-gray-400">
            *Certificado emitido digitalmente pela plataforma. Válido sem assinatura.
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateGenerator;
