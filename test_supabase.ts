import { createClient } from "@supabase/supabase-js";

async function run() {
  const supabase = createClient(
    "https://bcdiuxjolwilqaukygrd.supabase.co",
    "sb_publishable_geGvCffeQ6IHgOvIY09bzg_BZLP2zAV"
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
