import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

async function run() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.from("module_progress").upsert({
    user_id: "user_test123",
    trail_slug: "test_trail",
    module_id: 1,
    completed: true
  });

  console.log("Data:", data);
  console.log("Error:", error);
}

run();
