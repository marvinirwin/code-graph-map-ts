import React, {useEffect, useState} from 'react';
import './App.css';
import {getVoronoi} from "./voronoi";



// First I have to walk the tree and get a global registry of functions I have to traverse

function App() {
  const [el, setEl] = useState();
  useEffect(() => {
    if (el) {
      const {voronoi: v, names, namesPoints} = getVoronoi()
      // console.log(v.render())
      el.height = v.ymax - v.ymin;
      el.width = v.xmax - v.xmin;
      const ctx = el.getContext('2d');
      v.render(ctx);
      ctx.stroke();
      ctx.font = "30px Arial";
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const point = namesPoints[i];
        ctx.fillText(name, ...point)
      }
    }
  }, [el]);
  return (
      <canvas className="App" ref={setEl} width="1000" height="1000">
      </canvas>
  );
}

export default App;
