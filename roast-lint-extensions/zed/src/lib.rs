use zed_extension_api::{
    self as zed, process::Command, SlashCommand, SlashCommandOutput, SlashCommandOutputSection,
    Worktree,
};

struct RoastLintExtension;

impl zed::Extension for RoastLintExtension {
    fn new() -> Self {
        Self
    }

    fn run_slash_command(
        &self,
        command: SlashCommand,
        _args: Vec<String>,
        _worktree: Option<&Worktree>,
    ) -> Result<SlashCommandOutput, String> {
        match command.name.as_str() {
            "roast" => {
                // Execute the roast-lint CLI command via npx
                let output = Command::new("npx")
                    .args(["-y", "roast-lint"])
                    .output()
                    .map_err(|e| format!("Failed to run roast-lint: {}", e))?;

                if !output.status.success() {
                    return Err(format!(
                        "roast-lint failed: {}",
                        String::from_utf8_lossy(&output.stderr)
                    ));
                }

                let text = String::from_utf8_lossy(&output.stdout).to_string();

                Ok(SlashCommandOutput {
                    text,
                    sections: vec![SlashCommandOutputSection {
                        range: (0..0).into(), // Just for grouping
                        label: "Roast Lint Result".to_string(),
                    }],
                })
            }
            _ => Err(format!("Unknown slash command: {}", command.name)),
        }
    }
}

zed::register_extension!(RoastLintExtension);
