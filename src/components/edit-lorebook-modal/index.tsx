import { useState } from "react";
import ReactModal from "react-modal";
import { Lorebook } from "src/firebase";
import "./styles.css";

interface PublicProps {
  isOpen: boolean;
  closeModal: () => void;
  lorebook: Lorebook;
}

type Props = PublicProps;

export const EditLorebookModal = (props: Props) => {
  const [title, setTitle] = useState(props.lorebook.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTitle(value);
  };

  return (
    <ReactModal isOpen={props.isOpen} onRequestClose={props.closeModal} className="Modal">
      <h2>Edit {props.lorebook.title}</h2>
      <div>
        <label htmlFor="title">Title: </label>
        <input type="text" id="title" value={title} onChange={handleTitleChange} />
      </div>
      <div>fields here</div>
      <button>Save</button>
      <button onClick={props.closeModal}>Close</button>
    </ReactModal>
  );
};
