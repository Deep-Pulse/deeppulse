import { useEffect, useState } from "react"
import { supabase } from "../Authentication/supabase"

export default function EmployeeGroups({ onNavigate }) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null) 
  const [employees, setEmployees] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [groupName, setGroupName] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")

  const departments = ["All", "Facilities", "Quality nexus", "Tech", "HR", "Capdev"]

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    const { data, error } = await supabase.from("employee_groups").select("*")
    if (error) console.error("Error fetching groups:", error)
    else setGroups(data)
    setLoading(false)
  }

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from("employees").select("id, name, department")
    if (error) console.error("Error fetching employees:", error)
    else setEmployees(data)
  }

  const toggleEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((emp) => emp !== id))
    } else {
      setSelectedEmployees([...selectedEmployees, id])
    }
  }

  const handleSubmitGroup = async () => {
    if (!groupName) {
      alert("Please enter group name")
      return
    }

    if (editingGroup) {
      // Update existing group
      const { error } = await supabase
        .from("employee_groups")
        .update({ name: groupName, employees: selectedEmployees })
        .eq("id", editingGroup.id)

      if (error) {
        console.error("Error updating group:", error)
        alert("Failed to update group")
      } else {
        alert("Group updated successfully!")
        resetForm()
        fetchGroups()
      }
    } else {
      // Create new group
      const { error } = await supabase.from("employee_groups").insert([
        { name: groupName, employees: selectedEmployees },
      ])

      if (error) {
        console.error("Error creating group:", error)
        alert("Failed to create group")
      } else {
        alert("Group created successfully!")
        resetForm()
        fetchGroups()
      }
    }
  }

  const handleDeleteGroup = async (id) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return
    const { error } = await supabase.from("employee_groups").delete().eq("id", id)
    if (error) console.error("Error deleting group:", error)
    else {
      alert("Group deleted successfully!")
      fetchGroups()
    }
  }

  const handleCreateGroups = () => {
    setCreating(true)
    fetchEmployees()
  }

  const handleEditGroup = (group) => {
    setEditingGroup(group)
    setGroupName(group.name)
    setSelectedEmployees(group.employees || []) // ✅ pre-select employees
    setCreating(true) // ✅ reuse same form
    fetchEmployees()
  }

  const resetForm = () => {
    setCreating(false)
    setEditingGroup(null)
    setGroupName("")
    setSelectedEmployees([])
    setDepartmentFilter("All")
  }

  if (loading) return <p>Loading groups...</p>

  const filteredEmployees =
  departmentFilter === "All"
    ? employees
    : employees.filter((emp) => emp.department === departmentFilter)

// ✅ Sort employees so that selected ones come first
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      const aSelected = selectedEmployees.includes(a.id)
      const bSelected = selectedEmployees.includes(b.id)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      return 0
})


  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <h2>Employee Groups</h2>
        {!creating && !editingGroup && (
          <button style={styles.createBtn} onClick={handleCreateGroups}>
            Create Groups
          </button>
        )}
        {(creating || editingGroup) && (
          <button style={styles.backBtn} onClick={resetForm}>
            Back
          </button>
        )}
      </div>

      {/* Create / Edit group form */}
      {(creating || editingGroup) ? (
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
  {sortedEmployees.map((emp) => (
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

          <button
            style={styles.submitBtn}
            onClick={handleSubmitGroup}
          >
            {editingGroup ? "Update Group" : "Submit"}
          </button>
        </div>
      ) : (
        /* Groups list */
        <div style={styles.groupList}>
          {groups.length > 0 ? (
            groups.map((group) => (
              <div key={group.id || group.name} style={styles.groupCard}>
                <span style={styles.groupName}>{group.name}</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    style={styles.sendBtn}
                    onClick={() => onNavigate("QuestionGeneration", group.id)}
                  >
                    Send Forms
                  </button>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEditGroup(group)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDeleteGroup(group.id)}
                  >
                    Delete
                  </button>
                </div>
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
    width: "50%",
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
  editBtn: {
    padding: "6px 12px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#f44336",
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
