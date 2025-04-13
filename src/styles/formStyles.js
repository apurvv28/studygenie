import { color } from "framer-motion";

export const styles = {
  mainrehab:{
    overflowY: 'auto',
    maxWidth:'1000px',
    maxHeight:'80vh',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    maxHeight: '80vh', // Set a maximum height
    // overflowY: 'auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  webcamSection: {
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: '#dc3545',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#f8d7da',
    borderRadius: '4px',
  },
  result: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
  }
};