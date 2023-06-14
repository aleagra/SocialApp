import React from "react";
const Wrapper = (Component, Class) =>
  function HOC() {
    return (
      <>
        <section className={Class}>
          <Component />
        </section>
      </>
    );
  };

export default Wrapper;
