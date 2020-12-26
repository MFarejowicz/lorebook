import classnames from "classnames";
import { useContext, useState } from "react";
import { Entry, Field, FirebaseContext, Lorebook } from "src/firebase";
import "./styles.css";

interface PublicProps {
  lore: Lorebook[];
  editable: boolean;
}

type Props = PublicProps;

export const LorebookDisplay = (props: Props) => {
  const { db } = useContext(FirebaseContext);
  const [selectedLorebookIndex, setSelectedLorebookIndex] = useState(0);

  const addNewEntry = () => {
    const selectedLorebook = props.lore[selectedLorebookIndex];

    const newPostKey = db.ref(`/lore/${selectedLorebook.id}/entries`).push().key;
    const update: Entry = { id: newPostKey || "error" };

    db.ref(`/lore/${selectedLorebook.id}/entries/${newPostKey}`).update(update);
  };

  const renderTabs = () => {
    const selectedLorebook = props.lore[selectedLorebookIndex];

    return (
      <div className="LorebookDisplay-tabs">
        {props.lore.map((el, index) => (
          <div
            className={classnames("LorebookDisplay-tab", {
              "LorebookDisplay-tab__selected": el.id === selectedLorebook.id,
            })}
            onClick={() => setSelectedLorebookIndex(index)}
            key={`tab-${el.id}`}
          >
            <h2>{el.title}</h2>
          </div>
        ))}
        <div className="LorebookDisplay-tab">
          <h2>+</h2>
        </div>
      </div>
    );
  };

  const renderHeader = (fields: Field[]) => {
    return fields.map((field) => (
      <div className="LorebookDisplay-cell" key={`header-${field.id}`}>
        {field.name}
      </div>
    ));
  };

  const renderRow = (entry: Entry, fields: Field[]) => {
    return fields.map((field) => (
      <div className="LorebookDisplay-cell" key={`cell-${entry.id}-${field.id}`}>
        {entry[field.id] || "---"}
      </div>
    ));
  };

  const renderBody = () => {
    const selectedLorebook = props.lore[selectedLorebookIndex];
    const fields = Object.values(selectedLorebook.fields);
    const entries = Object.values(selectedLorebook.entries);

    return (
      <div
        className="LorebookDisplay-body"
        style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}
      >
        {renderHeader(fields)}
        {entries.map((entry) => renderRow(entry, fields))}
      </div>
    );
  };

  return (
    <div>
      {renderTabs()}
      {renderBody()}
      <div className="LorebookDisplay-new" onClick={addNewEntry}>
        +
      </div>
    </div>
  );
};
