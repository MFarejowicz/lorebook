import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { FieldType, PreField } from "src/firebase";
import "./styles.css";

interface PublicProps {
  isOpen: boolean;
  closeModal: () => void;
  onLorebookAdd: (title: string, fields: PreField[]) => void;
}

type Props = PublicProps;

export const NewLorebookModal = (props: Props) => {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<PreField[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setTitle("");
    setFields([]);
    setError(false);
  }, [props.isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTitle(value);
    setError(false);
  };

  const addField = () => {
    const newFields = [...fields];
    newFields.push({
      name: "",
      type: "text",
    });
    setFields(newFields);
    setError(false);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
    setError(false);
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    key: "name" | "type"
  ) => {
    const value = e.target.value as FieldType;

    const newFields = [...fields];
    const newField = { ...newFields[index], [key]: value };
    newFields[index] = newField;

    setFields(newFields);
    setError(false);
  };

  const addNewLorebook = () => {
    let valid = true;

    if (title === "") {
      valid = false;
      setError(true);
    }

    if (fields.length === 0 || fields.some((el) => el.name === "")) {
      valid = false;
      setError(true);
    }

    if (valid) {
      props.onLorebookAdd(title, fields);
    }
  };

  return (
    <ReactModal isOpen={props.isOpen} onRequestClose={props.closeModal} className="Modal">
      <h2>Create New Lorebook!</h2>
      <div>
        <label htmlFor="title">Title your lore: </label>
        <input type="text" id="title" value={title} onChange={handleTitleChange} />
      </div>
      <div>
        <p>Add fields:</p>
        {fields.map((field, index) => (
          <div key={`field-${index}`}>
            <label htmlFor={`field-name-${index}`}>Name: </label>
            <input
              id={`field-name-${index}`}
              type="text"
              value={field.name}
              onChange={(e) => handleFieldChange(e, index, "name")}
            />
            <label htmlFor={`field-type-${index}`}>Type: </label>
            <select
              id={`field-type-${index}`}
              value={field.type}
              onChange={(e) => handleFieldChange(e, index, "type")}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
            <button onClick={() => removeField(index)}>X</button>
          </div>
        ))}
        <button onClick={addField}>+</button>
      </div>
      {error && <div>A lorebook must have a title and at least one field!</div>}
      <button onClick={addNewLorebook}>Add</button>
      <button onClick={props.closeModal}>Close</button>
    </ReactModal>
  );
};
