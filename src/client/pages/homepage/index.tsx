import React from 'react';
import { useState } from "react";

export const Homepage = () => {
const [count, setCount] = React.useState(0);
  
  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(v => v + 1)}>count</button>
    </>
  )
}