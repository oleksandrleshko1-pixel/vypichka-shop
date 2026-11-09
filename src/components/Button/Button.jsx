import s from './Button.module.css';

export default function Button({ children, variant = 'primary', ...props }) {
  return (
    <button className={`${s.btn} ${s[variant]}`} {...props}>
      {children}
    </button>
  );
}
