import { useContext, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Field, FieldType, FirebaseContext, Lorebook } from "src/firebase";
import "./styles.css";

interface PublicProps {
  isOpen: boolean;
  closeModal: () => void;
  lorebook: Lorebook;
  onLorebookDelete: () => void;
}

type Props = PublicProps;

export const EditLorebookModal = (props: Props) => {
  const { db } = useContext(FirebaseContext);
  const [title, setTitle] = useState(props.lorebook.title);
  const [fields, setFields] = useState<Field[]>(Object.values(props.lorebook.fields || []));

  useEffect(() => {
    setTitle(props.lorebook.title);
    setFields(Object.values(props.lorebook.fields || []));
  }, [props.lorebook, props.isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTitle(value);
  };

  const hasTitleChanged = () => {
    return props.lorebook.title !== title;
  };

  const saveTitleChange = () => {
    const update = { title };
    db.ref(`/lore/${props.lorebook.id}`).update(update);
  };

  const cancelTitleChange = () => {
    setTitle(props.lorebook.title);
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
  };

  const hasFieldChanged = () => {
    const originalFields = Object.values(props.lorebook.fields || []);

    return fields.some((el, index) => {
      const originalField = originalFields[index];
      return el.name !== originalField.name || el.type !== originalField.type;
    });
  };

  const saveFieldChanges = () => {
    const updates: { [id: string]: Field } = {};
    for (const field of fields) {
      updates[field.id] = field;
    }
    db.ref(`/lore/${props.lorebook.id}/fields`).update(updates);
  };

  const cancelFieldChanges = () => {
    const originalFields = Object.values(props.lorebook.fields || []);

    setFields(originalFields);
  };

  const deleteLorebook = () => {
    db.ref(`/lore/${props.lorebook.id}`).remove();
    props.onLorebookDelete();
  };

  return (
    <ReactModal isOpen={props.isOpen} onRequestClose={props.closeModal} className="Modal">
      <h2>Edit {props.lorebook.title}</h2>
      <div>
        <label htmlFor="title">Title: </label>
        <input type="text" id="title" value={title} onChange={handleTitleChange} />
        {hasTitleChanged() && (
          <>
            <button onClick={saveTitleChange}>Save</button>
            <button onClick={cancelTitleChange}>Cancel</button>
          </>
        )}
      </div>
      <div>
        <p>Edit fields:</p>
        {fields.map((field, index) => (
          <div key={`field-${index}`}>
            <label htmlFor={`field-name-${index}`}>Name: </label>
            <input
              id={`field-name-${index}`}
              type="text"
              value={field.name}
              onChange={(e) => handleFieldChange(e, index, "name")}
            />
            <select
              id={`field-type-${index}`}
              value={field.type}
              onChange={(e) => handleFieldChange(e, index, "type")}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>
        ))}
        {hasFieldChanged() && (
          <>
            <button onClick={saveFieldChanges}>Save</button>
            <button onClick={cancelFieldChanges}>Cancel</button>
          </>
        )}
      </div>
      <button onClick={props.closeModal}>Close</button>
      <button onClick={deleteLorebook}>DELETE LOREBOOK!!!</button>
    </ReactModal>
  );
};
