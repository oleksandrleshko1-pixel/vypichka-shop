import s from './Input.module.css';

export default function Input(props) {
  return <input className={s.input} {...props} />;
}
