function App () {
  const handleChange = (event) => {
    //synthetic event
    console.log(event);
    //value of tagrget (here: input html element)
    console.log(event.target.value);
  };
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />
    </div>
  );
}

export default App