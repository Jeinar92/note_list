import "./styles.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Note = ({ note }) => {
  return (
    <li>
      <strong>{note.title}</strong>
      <p>{note.body}</p>
    </li>
  );
};
const NoteFiltered = ({ note }) => {
  return (
    <div>
      <strong>{note.title}</strong>
      <p>{note.body}</p>
    </div>
  );
};
const Filter = ({ handleFilter, handleOnChangeFilter, filterby, filtered }) => {
  return (
    <div>
      <form onSubmit={handleFilter}>
        filter shown with:{" "}
        <input type="text" onChange={handleOnChangeFilter} value={filterby} />
      </form>
      {filterby.length <= 0
        ? " "
        : filtered.map((filter) => (
            <NoteFiltered key={filter.title} note={filter} />
          ))}
    </div>
  );
};
const PersonForm = ({
  handleSubmit,
  handleOnChangeTitle,
  newTitle,
  handleOnChangeBody,
  newBody
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        Title:{" "}
        <input type="text" onChange={handleOnChangeTitle} value={newTitle} />
      </div>
      <div>
        Note:{" "}
        <input type="text" onChange={handleOnChangeBody} value={newBody} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
const Notes = ({ notes }) => {
  return (
    <ul>
      {notes.map((note) => (
        <Note key={note.title} note={note} />
      ))}
    </ul>
  );
};
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [filterby, setNewFilter] = useState("");
  const [filtered, setFiltered] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);

  /* useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())
        .then((json) => {
          setIsLoading(false);
          setNotes([...json]);
        });
    }, 2000);
  }, []);*/
  useEffect(() => {
    setIsLoading(true);
    axios.get("https://jsonplaceholder.typicode.com/posts").then((response) => {
      const { data } = response;
      setNotes(data);
      setIsLoading(false);
      console.log(data);
    });
  }, []);

  const handleOnChangeTitle = (event) => {
    setNewTitle(event.target.value);
  };
  const handleOnChangeBody = (event) => {
    setNewBody(event.target.value);
  };
  const handleOnChangeFilter = (event) => {
    setNewFilter(event.target.value);
  };
  const handleFilter = (event) => {
    event.preventDefault();
    const filteredTitles = notes.filter((note) =>
      note.title.toLocaleLowerCase().includes(filterby.toLocaleLowerCase())
    );
    if (filteredTitles.length === 0) {
      alert("Note not found");
      setFiltered([]);
    } else {
      setFiltered([...filteredTitles]);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const noteToAddToState = {
      id: notes.length + 1,
      title: newTitle,
      body: newBody
    };

    if (newTitle === "" || newBody === "") {
      alert("Fields can't be empty");
    } else if (notes.some(({ title }) => title === newTitle)) {
      alert(newTitle + " is already added to notes");
    } else {
      setNotes([...notes, noteToAddToState]);
    }
    setNewTitle("");
    setNewBody("");
  };

  return (
    <div>
      <h2>Notes</h2>
      <Filter
        handleFilter={handleFilter}
        handleOnChangeFilter={handleOnChangeFilter}
        filterby={filterby}
        filtered={filtered}
      />
      <h3> add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        handleOnChangeTitle={handleOnChangeTitle}
        handleOnChangeBody={handleOnChangeBody}
        newTitle={newTitle}
        newBody={newBody}
      />
      <h3>List of notes</h3>
      {isLoading ? "Loading..." : " "}
      <Notes notes={notes} />
    </div>
  );
};

export default App;
