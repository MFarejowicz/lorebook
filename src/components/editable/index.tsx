import { createRef, useContext, useEffect, useState } from "react";
import { Entry, Field, FieldType, FirebaseContext, Lorebook } from "src/firebase";
import { enterPress, initialEditable, usePrevious } from "src/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles.css";

interface PublicProps {
  initialValue: string | boolean | null;
  lorebook: Lorebook;
  field: Field;
  entry: Entry;
}

type Props = PublicProps;

export const Editable = (props: Props) => {
  const { db } = useContext(FirebaseContext);
  const [value, setValue] = useState(initialEditable(props.initialValue, props.field.type));
  const [isEditing, setIsEditing] = useState(false);
  const prevIsEditing = usePrevious(isEditing);
  const inputRef = createRef<HTMLInputElement>();
  const outputRef = createRef<HTMLDivElement>();

  useEffect(() => {
    setValue(initialEditable(props.initialValue, props.field.type));
  }, [props.initialValue, props.field.type]);

  useEffect(() => {
    if (!prevIsEditing && isEditing) {
      inputRef.current?.focus();
    }

    if (prevIsEditing && !isEditing) {
      outputRef.current?.focus();
    }
  }, [prevIsEditing, isEditing, inputRef, outputRef]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, type: FieldType) => {
    let newValue;
    if (type === "checkbox") {
      newValue = e.target.checked;
    } else {
      newValue = e.target.value;
    }

    setValue(newValue);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    setIsEditing(false);

    const update = { [props.field.id]: value };
    db.ref(`/lore/${props.lorebook.id}/entries/${props.entry.id}`).update(update);
  };

  const cancelEdit = () => {
    setValue(initialEditable(props.initialValue, props.field.type));
    setIsEditing(false);
  };

  const renderEditing = () => {
    if (props.field.type === "checkbox") {
      return (
        <input
          checked={Boolean(value)}
          onChange={(e) => onChange(e, props.field.type)}
          type={props.field.type}
          ref={inputRef}
        />
      );
    }

    return (
      <input
        value={String(value)}
        onChange={(e) => onChange(e, props.field.type)}
        type={props.field.type}
        ref={inputRef}
      />
    );
  };

  const renderNotEditing = () => {
    if (props.field.type === "checkbox") {
      if (value) {
        return <FontAwesomeIcon icon={["far", "check-square"]} />;
      }

      return <FontAwesomeIcon icon={["far", "square"]} />;
    }

    return <span>{value}</span>;
  };

  if (isEditing) {
    return (
      <div className="Editable">
        {renderEditing()}
        <button onClick={saveEdit}>Save</button>
        <button onClick={cancelEdit}>Cancel</button>
      </div>
    );
  }

  return (
    <div
      className="LorebookDisplay-cell"
      onClick={startEditing}
      onKeyPress={enterPress(startEditing)}
      tabIndex={0}
      ref={outputRef}
    >
      {renderNotEditing()}
    </div>
  );
};
