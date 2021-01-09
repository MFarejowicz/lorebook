import classnames from "classnames";
import { useContext, useState } from "react";
import { Entry, Field, FirebaseContext, Lorebook } from "src/firebase";
import { enterPress } from "src/utils";
import { EditLorebookModal } from "../edit-lorebook-modal";
import { Editable } from "../editable";
import "./styles.css";

interface PublicProps {
  lore: Lorebook[];
  editable: boolean;
  openModal: () => void;
}

type Props = PublicProps;

export const LorebookDisplay = (props: Props) => {
  const { db } = useContext(FirebaseContext);

  // set initial state from props
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedLorebook = props.lore[selectedIndex];

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const addNewEntry = () => {
    const newPostKey = db.ref(`/lore/${selectedLorebook.id}/entries`).push().key;
    if (newPostKey) {
      const update: Entry = { id: newPostKey };

      db.ref(`/lore/${selectedLorebook.id}/entries/${newPostKey}`).update(update);
    }
  };

  const renderTabs = () => {
    return (
      <div className="LorebookDisplay-tabs">
        {props.lore.map((el, index) => (
          <div
            className={classnames("LorebookDisplay-tab", {
              "LorebookDisplay-tab__selected": index === selectedIndex,
            })}
            onClick={() => setSelectedIndex(index)}
            onKeyPress={enterPress(() => setSelectedIndex(index))}
            tabIndex={0}
            key={`tab-${el.id}`}
          >
            <h2 className="LorebookDisplay-tab-title">{el.title}</h2>
            {index === selectedIndex && <button onClick={openModal}>E</button>}
          </div>
        ))}
        <div
          className="LorebookDisplay-tab"
          onClick={props.openModal}
          onKeyPress={enterPress(props.openModal)}
          tabIndex={0}
        >
          <h2>+</h2>
        </div>
      </div>
    );
  };

  const renderHeader = (fields: Field[]) => {
    return (
      <div className="LorebookDisplay-row">
        {fields.map((field) => (
          <div className="LorebookDisplay-header LorebookDisplay-cell" key={`header-${field.id}`}>
            {field.name}
          </div>
        ))}
      </div>
    );
  };

  const renderRow = (entry: Entry, fields: Field[]) => {
    return (
      <div className="LorebookDisplay-row" key={`row-${entry.id}`}>
        {fields.map((field) => (
          <Editable
            key={`cell-${entry.id}-${field.id}`}
            initialValue={entry[field.id] || "---"}
            lorebook={selectedLorebook}
            field={field}
            entry={entry}
          />
        ))}
      </div>
    );
  };

  const renderBody = () => {
    const fields = Object.values(selectedLorebook.fields || []);
    const entries = Object.values(selectedLorebook.entries || []);

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

  const onLorebookDelete = () => {
    setModalOpen(false);
    setSelectedIndex(0);
  };

  return (
    <div>
      {renderTabs()}
      {renderBody()}
      <div className="LorebookDisplay-new" onClick={addNewEntry}>
        +
      </div>
      <EditLorebookModal
        isOpen={modalOpen}
        closeModal={closeModal}
        lorebook={selectedLorebook}
        onLorebookDelete={onLorebookDelete}
      />
    </div>
  );
};
