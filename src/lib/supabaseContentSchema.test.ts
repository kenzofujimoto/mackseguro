import { describe, expect, it } from "vitest";
import schemaSql from "../../supabase-rls.sql?raw";

describe("Supabase content schema", () => {
  it("defines content tables with RLS policies for public reads and admin writes", () => {
    expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS admin_users/i);
    expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS trails/i);
    expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS modules/i);
    expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS module_contents/i);
    expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS quiz_questions/i);
    expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS quiz_options/i);
    expect(schemaSql).toMatch(/CREATE OR REPLACE FUNCTION is_admin/i);
    expect(schemaSql).toMatch(/ALTER TABLE trails ENABLE ROW LEVEL SECURITY/i);
    expect(schemaSql).toMatch(/CREATE POLICY "Leitura pública de trilhas publicadas"/i);
    expect(schemaSql).toMatch(/CREATE POLICY "Administradores gerenciam trilhas"/i);
  });
});
