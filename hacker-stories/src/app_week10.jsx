const students = [
    { suid: 123456, name: "Sue Flay", year: "senior", major: "Applied Data Analytics" },
    { suid: 234567, name: "Ella Vader", year: "junior", major: "Information Management and Technology" },
    { suid: 345678, name: "Chris P Bacon", year: "junior", major: "Innovation, Society and Technology" }
  ];
  
  const filteredStudents = students.filter(student => student.name === "Sue Flay");
  
  const Students = () => {
    return (
      <ul>
        {filteredStudents.map((student) => (
          <li key={student.suid}>
            Name: {student.name} <br/>
            Year: {student.year} <br/>
            Major: {student.major}
          </li>
        ))}
      </ul>
    );
  };
  
  const App = () => {
    return (
      <div>
        <h1>Students</h1>
        <Students />
      </div>
    );
  };
  
  export default App;