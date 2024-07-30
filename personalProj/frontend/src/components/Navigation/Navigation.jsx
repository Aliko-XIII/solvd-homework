import React, { useContext } from 'react';
import { SetStateAction, createContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { HospitalContext } from "../App";
import getUserLinks from './getLinks';

const Navigation = () => {
  const { role } = useContext(HospitalContext);
  const [linksArr, setLinksArr] = useState([]);

  useEffect(() => {
    setLinksArr(getUserLinks(role.name));
  }, [role]);

  return (
    <nav>
      {linksArr.map((obj, index) => (
        <NavLink
          key={index}
          to={obj.link}
          style={({ isActive }) => ({
            color: isActive ? "blue" : "black",
          })}
        >
          {obj.title}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;