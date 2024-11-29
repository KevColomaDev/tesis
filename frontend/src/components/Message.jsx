import PropTypes from 'prop-types';

export const Mensaje = ({ type, message }) => {
  return (
    <div className={`fixed border ${type==="Error: " ? 'bg-red-100  border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} px-4 py-3 rounded sm:right-5 right-2 top-5`} role="alert">
      <strong className="font-bold">{type} </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  )
}

Mensaje.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
};