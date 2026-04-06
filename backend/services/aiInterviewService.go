package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

type InterviewQuestion struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

type InterviewQuestionsResponse struct {
	Questions []InterviewQuestion `json:"questions"`
}

func GenerateInterviewQuestions(topic string, description string, count int) ([]InterviewQuestion, error) {
	apiKey := os.Getenv("GROQ_API_KEY")

	prompt := fmt.Sprintf(`You are an expert technical interviewer.

Generate exactly %d interview questions for a mock interview.

Topic: %s
Description: %s

For each question, also provide a model answer that the interviewer can use to evaluate the candidate.

Return ONLY a JSON object in this exact format, no extra text:
{
  "questions": [
    {
      "question": "The interview question here",
      "answer": "A detailed model answer the interviewer can use to evaluate the response"
    }
  ]
}

Make the questions progressively more challenging. Mix conceptual, practical, and scenario-based questions.`, count, topic, description)

	body := map[string]interface{}{
		"model": "llama-3.3-70b-versatile",
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"temperature": 0.7,
	}

	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest(
		"POST",
		"https://api.groq.com/openai/v1/chat/completions",
		bytes.NewBuffer(jsonBody),
	)

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return nil, fmt.Errorf("AI response missing choices")
	}

	choice := choices[0].(map[string]interface{})
	message := choice["message"].(map[string]interface{})
	content := message["content"].(string)

	content = strings.TrimSpace(content)
	content = strings.ReplaceAll(content, "```json", "")
	content = strings.ReplaceAll(content, "```", "")

	jsonStart := strings.Index(content, "{")
	jsonEnd := strings.LastIndex(content, "}")
	if jsonStart != -1 && jsonEnd != -1 {
		content = content[jsonStart : jsonEnd+1]
	}

	var qResp InterviewQuestionsResponse
	err = json.Unmarshal([]byte(content), &qResp)
	if err != nil {
		fmt.Println("JSON PARSE ERROR (questions):", err)
		return nil, err
	}

	return qResp.Questions, nil
}
