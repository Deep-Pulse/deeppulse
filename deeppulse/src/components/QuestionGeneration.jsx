import { useState } from "react"
import { supabase } from "../Authentication/supabase"

export default function QuestionGeneration({ groupId, onNavigate }) {
    const [questions, setQuestions] = useState([])
    const [sendDate, setSendDate] = useState("")

    // Add new question template
    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                label: "",
                name: "",
                type: "text",
                options: [],
                multiline: false,
                fullwidth: false,
            },
        ])
    }

    // Remove option from MCQ
    const removeOption = (qIndex, optIndex) => {
  setQuestions((prev) => {
    const updated = [...prev]
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex)
    return updated
  })
}


    // Update question field
    const updateQuestion = (index, field, value) => {
        const updated = [...questions]
        updated[index][field] = value
        setQuestions(updated)
    }

    // Add option for MCQ
    const addOption = (index) => {
        const updated = [...questions]
        updated[index].options.push("")
        setQuestions(updated)
    }

    // Update MCQ option
    const updateOption = (qIndex, optIndex, value) => {
        const updated = [...questions]
        updated[qIndex].options[optIndex] = value
        setQuestions(updated)
    }

    // Submit handler
    const handleSubmit = async () => {
        if (!sendDate) {
            alert("Please select a send date")
            return
        }

        const { error } = await supabase
            .from("employee_groups")
            .update({
                questions: questions,
                send_date: sendDate,
            })
            .eq("id", groupId)

        if (error) {
            console.error("Error saving questions:", error)
            alert("Failed to save questions")
        } else {
            alert("Questions saved successfully!")
            onNavigate("EmployeeGroups")
        }
    }

    // Min date = tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split("T")[0]

    return (
        <div style={styles.page}>
            <h2>Question Generation</h2>

            {/* Questions list */}
            {questions.map((q, index) => (

                <div key={index} style={styles.questionCard}>
                    <button
                        type="button"
                        onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                        style={{ background: "red", color: "white", border: "none", borderRadius: "5px", padding: "5px 10px", float: "right" }}
                    >
                        🗑️ Remove Question
                    </button>
                    <input
                        type="text"
                        placeholder="Label"
                        value={q.label}
                        onChange={(e) => updateQuestion(index, "label", e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Short Key (name)"
                        value={q.name}
                        onChange={(e) => updateQuestion(index, "name", e.target.value)}
                        style={styles.input}
                    />

                    {/* Type Dropdown */}
                    <select
                        value={q.type}
                        onChange={(e) => updateQuestion(index, "type", e.target.value)}
                        style={styles.dropdown}
                    >
                        <option value="text">Text</option>
                        <option value="rating">Rating</option>
                        <option value="nps">NPS</option>
                        <option value="mcq">MCQ</option>
                    </select>

                    {/* Multiline toggle only for text */}
                    {q.type === "text" && (
                        <label style={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={q.multiline}
                                onChange={(e) => updateQuestion(index, "multiline", e.target.checked)}
                            />
                            Multiline Response
                        </label>
                    )}

                    {/* MCQ Options */}
                    
{q.type === "mcq" && (
  <div style={styles.optionsBox}>
    {q.options.map((opt, optIndex) => (
      <div key={optIndex} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <input
          type="text"
          placeholder={`Option ${optIndex + 1}`}
          value={opt}
          onChange={(e) => updateOption(index, optIndex, e.target.value)}
          style={{ ...styles.input, flex: 1 }}
        />
        <button
          style={styles.deleteSmallBtn}
          onClick={() => removeOption(index, optIndex)}
        >
          ✕
        </button>
      </div>
    ))}
    <button style={styles.smallBtn} onClick={() => addOption(index)}>
      + Add Option
    </button>
  </div>
)}


                    {/* Fullwidth toggle */}
                    <label style={styles.checkbox}>
                        <input
                            type="checkbox"
                            checked={q.fullwidth}
                            onChange={(e) => updateQuestion(index, "fullwidth", e.target.checked)}
                        />
                        Full Width
                    </label>

                    {/* Add Question button BELOW each question */}
                    {index === questions.length - 1 && (
                        <button style={styles.addBtn} onClick={handleAddQuestion}>
                            + Add Question
                        </button>
                    )}
                </div>
            ))}

            {/* If no question exists, show first Add button */}
            {questions.length === 0 && (
                <button style={styles.addBtn} onClick={handleAddQuestion}>
                    + Add First Question
                </button>
            )}

            {/* Send Date */}
            <div style={styles.dateBox}>
                <label>Send Date: </label>
                <input
                    type="date"
                    min={minDate}
                    value={sendDate}
                    onChange={(e) => setSendDate(e.target.value)}
                    style={styles.input}
                />
            </div>

            {/* Submit */}
            <button style={styles.submitBtn} onClick={handleSubmit}>
                Submit
            </button>
        </div>
    )
}

const styles = {
    page: { padding: "20px", fontFamily: "Arial, sans-serif" },
    addBtn: {
        padding: "8px 16px",
        marginTop: "10px",
        marginBottom: "20px",
        backgroundColor: "#4caf50",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    questionCard: {
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        background: "#f9f9f9",
    },
    input: {
        display: "block",
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "6px",
    },
    dropdown: {
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        borderRadius: "6px",
    },
    checkbox: { display: "block", marginBottom: "8px" },
    optionsBox: { marginBottom: "10px" },
    smallBtn: {
        padding: "6px 12px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    dateBox: { marginTop: "20px", marginBottom: "20px" },
    submitBtn: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    deleteSmallBtn: {
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  padding: "4px 8px",
}
}
