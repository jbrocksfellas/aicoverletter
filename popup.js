document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKeyInput");
  const saveApiKeyButton = document.getElementById("saveApiKeyButton");
  const resumeText = document.getElementById("resumeText");
  const saveButton = document.getElementById("saveButton");
  const jobDescriptionInput = document.getElementById("jobDescriptionInput");
  const addJobButton = document.getElementById("addJobButton");
  const generatedText = document.getElementById("generatedText");
  const resetButton = document.getElementById("resetButton");

  // Load saved resume text from storage
  chrome.storage.sync.get(["resume"], function (result) {
    const savedResume = result.resume;
    if (savedResume) {
      saveButton.textContent = "Edit Resume";
      resumeText.style.display = "none";
      resumeText.value = savedResume;
    }
  });

  // Load saved openai API Key text from storage
  chrome.storage.sync.get(["openaiApiKey"], function (result) {
    const savedKey = result.openaiApiKey;
    if (savedKey) {
      saveApiKeyButton.textContent = "Edit API Key";
      apiKeyInput.style.display = "none";
      apiKeyInput.value = savedKey;
    }
  });

  // Load saved cover letter text from storage
  chrome.storage.sync.get(["lastCoverLetter"], function (result) {
    const savedCoverLetter = result.lastCoverLetter;
    if (savedCoverLetter) {
      generatedText.innerHTML = savedCoverLetter;
    }
  });

  saveApiKeyButton.addEventListener("click", function () {
    if (saveApiKeyButton.textContent === "Save API Key") {
      saveApiKeyButton.textContent = "Edit API Key";
      apiKeyInput.style.display = "none";
      const newApiKey = apiKeyInput.value;
      chrome.storage.sync.set({ openaiApiKey: newApiKey }, function () {
        console.log("Openai API key saved successfully.");
      });
    } else {
      saveApiKeyButton.textContent = "Save API Key";
      apiKeyInput.style.display = "inline";
    }
  });

  saveButton.addEventListener("click", function () {
    if (saveButton.textContent === "Save Resume") {
      saveButton.textContent = "Edit Resume";
      resumeText.style.display = "none";
      const newResume = resumeText.value;
      chrome.storage.sync.set({ resume: newResume }, function () {
        console.log("Resume saved successfully.");
      });
    } else {
      saveButton.textContent = "Save Resume";
      resumeText.style.display = "block";
    }
  });

  addJobButton.addEventListener("click", function () {
    const jobDescription = jobDescriptionInput.value;
    if (jobDescription) {
      // Call backend API to generate text (simulated here)
      const generatedTextContent = "Generated text: " + jobDescription;
      generatedText.textContent = generatedTextContent;
    }
  });

  addJobButton.addEventListener("click", function () {
    if (jobDescriptionInput) {
      console.log("clicked btn");
      console.log(apiKeyInput.value);
      if (apiKeyInput.value) {
        let prompt = `You are a professional cover letter writer with 20 years of experience. Use the Job Description and Resume to learn from and construct an amazing cover letter.
Job Description: ${jobDescriptionInput.value}
Resume: ${resumeText.value}

You are writing a cover letter applying for the [job_role] role at [job_company_name]. Create a cover letter following the below points.
- Find out the biggest challenge someone in this position would face day-to-day and add some points in the cover letter explaining how it aligns with your profile.
- Write an attention-grabbing hook for your cover letter that highlights your experience and qualifications in a way that shows you empathize and can successfully take on the challenges of the [job_role] role
- Consider incorporating specific examples of how you've tackled these challenges in your past work, and explore creative ways to express your enthusiasm for the opportunity, Keep your hook within 100 words
- Fill up current details like [current_role], [current_industry_name] from the resume.
- Fill up job_role, [job_company_name] form [job description]
- Finish writing the cover letter based on your resume and above collected information of job and keep it within 250 words. Don't make up information. Write only on the behalf of my resume.
- Remove any buzzwords present in the final cover letter.`;

        generatedText.textContent = "Loading...";

        fetch(`https://api.openai.com/v1/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKeyInput.value },
          body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            const assistantReply = data.choices[0].message.content;
            const formattedAssistantReply = assistantReply.replace(/\n/g, "<br>");
            generatedText.innerHTML = formattedAssistantReply;
            resetButton.style.display = "inline-block";

            chrome.storage.sync.set({ lastCoverLetter: formattedAssistantReply }, function () {
              console.log("Cover letter saved successfully.");
            });
          });
      }
    }
  });

  resetButton.addEventListener("click", function () {
    generatedText.innerHTML = "";
    resetButton.style.display = "none";
  });
});
