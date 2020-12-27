import { useContext, useState } from "react";
import { Entry, Field, FirebaseContext, Lorebook } from "src/firebase";
import "./styles.css";

interface PublicProps {
  initialValue: string;
  lorebook: Lorebook;
  field: Field;
  entry: Entry;
}

type Props = PublicProps;

export const Editable = (props: Props) => {
  const { db } = useContext(FirebaseContext);
  const [text, setText] = useState(props.initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setText(value);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    setIsEditing(false);

    const update = { [props.field.id]: text };

    db.ref(`/lore/${props.lorebook.id}/entries/${props.entry.id}`).update(update);
  };

  const cancelEdit = () => {
    setText(props.initialValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="Editable">
        <input value={text} onChange={onChange} type={props.field.type} />
        <button onClick={saveEdit}>Save</button>
        <button onClick={cancelEdit}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="LorebookDisplay-cell" onClick={startEditing}>
      {text}
    </div>
  );
};
