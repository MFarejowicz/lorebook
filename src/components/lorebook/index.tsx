import classnames from "classnames";
import { useContext, useEffect, useState } from "react";
import { Entry, Field, FirebaseContext, Lorebook, PreField } from "src/firebase";
import { enterPress } from "src/utils";
import { Editable } from "../editable";
import { NewLorebookModal } from "../new-lorebook-modal";
import "./styles.css";

interface PublicProps {
  lore: Lorebook[];
  editable: boolean;
  onAddNewLorebook: () => void;
}

type Props = PublicProps;

export const LorebookDisplay = (props: Props) => {
  const { db, user } = useContext(FirebaseContext);

  // set initial state from props
  const [selectedLoreID, setSelectedLoreID] = useState(props.lore[0].id);
  const [lorebookData, setLorebookData] = useState<Lorebook>(props.lore[0]);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const listener = db.ref(`/lore/${selectedLoreID}`).on("value", (lorebookSnapshot) => {
      setLorebookData(lorebookSnapshot.val());
    });

    return () => {
      db.ref(`/lore/${selectedLoreID}`).off("value", listener);
    };
  }, [db, selectedLoreID]);

  const addNewLorebook = async (title: string, fields: PreField[]) => {
    const newLorebookKey = db.ref(`/lore`).push().key;
    if (newLorebookKey && user) {
      const update: Lorebook = {
        id: newLorebookKey,
        author: user.uid,
        title,
      };

      await db.ref(`/lore/${newLorebookKey}`).update(update);

      for (const field of fields) {
        const newFieldKey = db.ref(`/lore/${newLorebookKey}/fields`).push().key;
        if (newFieldKey) {
          const fieldUpdate: Field = {
            id: newFieldKey,
            name: field.name,
            type: field.type,
          };

          await db.ref(`/lore/${newLorebookKey}/fields/${newFieldKey}`).update(fieldUpdate);
        }
      }

      closeModal();
      props.onAddNewLorebook();
    }
  };

  const addNewEntry = () => {
    const newPostKey = db.ref(`/lore/${selectedLoreID}/entries`).push().key;
    if (newPostKey) {
      const update: Entry = { id: newPostKey };

      db.ref(`/lore/${selectedLoreID}/entries/${newPostKey}`).update(update);
    }
  };

  const renderTabs = () => {
    return (
      <div className="LorebookDisplay-tabs">
        {props.lore.map((el) => (
          <div
            className={classnames("LorebookDisplay-tab", {
              "LorebookDisplay-tab__selected": el.id === selectedLoreID,
            })}
            onClick={() => setSelectedLoreID(el.id)}
            onKeyPress={enterPress(() => setSelectedLoreID(el.id))}
            tabIndex={0}
            key={`tab-${el.id}`}
          >
            <h2>{el.title}</h2>
          </div>
        ))}
        <div
          className="LorebookDisplay-tab"
          onClick={openModal}
          onKeyPress={enterPress(openModal)}
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
            lorebook={lorebookData}
            field={field}
            entry={entry}
          />
        ))}
      </div>
    );
  };

  const renderBody = () => {
    const fields = Object.values(lorebookData.fields || []);
    const entries = Object.values(lorebookData.entries || []);

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
      <NewLorebookModal
        isOpen={modalOpen}
        closeModal={closeModal}
        addNewLorebook={addNewLorebook}
      />
      {renderTabs()}
      {renderBody()}
      <div className="LorebookDisplay-new" onClick={addNewEntry}>
        +
      </div>
    </div>
  );
};
