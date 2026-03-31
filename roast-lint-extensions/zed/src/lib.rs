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
            "test" => Ok(SlashCommandOutput {
                text: "Test command works!".to_string(),
                sections: vec![SlashCommandOutputSection {
                    range: (0u32..18u32).into(),
                    label: "Test Result".to_string(),
                }],
            }),
            "roast" => {
                // Execute the roast-lint CLI command via npx
                let output = Command::new("npx")
                    .args(["-y", "roast-lint"])
                    .output()
                    .map_err(|e| format!("Failed to run roast-lint: {}", e))?;

                if output.status != Some(0) {
                    return Err(format!(
                        "roast-lint failed: {}",
                        String::from_utf8_lossy(&output.stderr)
                    ));
                }

                let text = String::from_utf8_lossy(&output.stdout).to_string();
                let text_len = text.len() as u32;

                Ok(SlashCommandOutput {
                    text,
                    sections: vec![SlashCommandOutputSection {
                        range: (0u32..text_len).into(),
                        label: "Roast Lint Result".to_string(),
                    }],
                })
            }
            _ => Err(format!("Unknown slash command: {}", command.name)),
        }
    }

    fn complete_slash_command_argument(
        &self,
        _command: SlashCommand,
        _args: Vec<String>,
    ) -> Result<Vec<zed::SlashCommandArgumentCompletion>, String> {
        Ok(vec![])
    }
}

zed::register_extension!(RoastLintExtension);
