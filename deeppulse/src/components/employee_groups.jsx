import { useEffect, useState } from "react"
import { supabase } from "../Authentication/supabase"

export default function EmployeeGroups({ onNavigate }) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [employees, setEmployees] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [groupName, setGroupName] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")

  // Departments fixed list
  const departments = ["All", "Facilities", "Quality nexus", "Tech", "HR", "Capdev"]

  // Fetch groups
  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    const { data, error } = await supabase.from("employee_groups").select("*")
    if (error) console.error("Error fetching groups:", error)
    else setGroups(data)
    setLoading(false)
  }

  // Fetch employees (for create group form)
  const fetchEmployees = async () => {
    const { data, error } = await supabase.from("employees").select("id, name, department")
    if (error) console.error("Error fetching employees:", error)
    else setEmployees(data)
  }

  // Toggle employee selection
  const toggleEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((emp) => emp !== id))
    } else {
      setSelectedEmployees([...selectedEmployees, id])
    }
  }

  // Handle create group
  const handleSubmitGroup = async () => {
    if (!groupName) {
      alert("Please enter group name")
      return
    }

    const { error } = await supabase.from("employee_groups").insert([
      { name: groupName, employees: selectedEmployees },
    ])

    if (error) {
      console.error("Error creating group:", error)
      alert("Failed to create group")
    } else {
      alert("Group created successfully!")
      setCreating(false)
      setGroupName("")
      setSelectedEmployees([])
      fetchGroups() // refresh list
    }
  }

  const handleCreateGroups = () => {
    setCreating(true)
    fetchEmployees()
  }

  if (loading) return <p>Loading groups...</p>

  // Apply filter
  const filteredEmployees =
    departmentFilter === "All"
      ? employees
      : employees.filter((emp) => emp.department === departmentFilter)

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <h2>Employee Groups</h2>
        {!creating && (
          <button style={styles.createBtn} onClick={handleCreateGroups}>
            Create Groups
          </button>
        )}
        {creating && (
          <button style={styles.backBtn} onClick={() => setCreating(false)}>
            Back
          </button>
        )}
      </div>

      {/* Create group form */}
      {creating ? (
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={styles.input}
          />

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={styles.dropdown}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Employee Tiles */}
          <div style={styles.employeeGrid}>
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                style={{
                  ...styles.employeeCard,
                  border: selectedEmployees.includes(emp.id)
                    ? "2px solid #007bff"
                    : "1px solid #ccc",
                }}
                onClick={() => toggleEmployee(emp.id)}
              >
                {emp.name}
                <div style={styles.empDept}>{emp.department}</div>
              </div>
            ))}
          </div>

          <button style={styles.submitBtn} onClick={handleSubmitGroup}>
            Submit
          </button>
        </div>
      ) : (
        /* Groups list */
        <div style={styles.groupList}>
          {groups.length > 0 ? (
            groups.map((group) => (
              <div key={group.id || group.name} style={styles.groupCard}>
                <span style={styles.groupName}>{group.name}</span>
                <button
                  style={styles.sendBtn}
                  onClick={() => onNavigate("QuestionGeneration", group.id)}
                >
                  Send Forms
                </button>
              </div>
            ))
          ) : (
            <p>No groups found.</p>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: "20px", fontFamily: "Arial, sans-serif" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  createBtn: {
    padding: "8px 16px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  backBtn: {
    padding: "8px 16px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  groupList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  groupCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    width: "50%", // 👈 limit to 50% width
  },
  groupName: { fontSize: "16px", fontWeight: "bold" },
  sendBtn: {
    padding: "6px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  form: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  dropdown: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  employeeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "10px",
    marginBottom: "15px",
  },
  employeeCard: {
    background: "#f9f9f9",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
  },
  empDept: { fontSize: "12px", color: "gray", marginTop: "5px" },
  submitBtn: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
}
