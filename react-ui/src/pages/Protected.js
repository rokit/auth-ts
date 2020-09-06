import React, { useState, useEffect } from 'react';
import useProtected from '../hooks/useProtected';
// import './Protected.css';

function Protected(props) {
  useProtected();
  return (
    <main>
      This is a protected page.
    </main>
  )
}

export default Protected;
