import React from 'react';

// {...input} gives an object with all of the items so.. instead of
// long writing out onBlur=input.onBlur, onClick.. etc
// also note the nested destructuring with the meta object
export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }}/>
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};