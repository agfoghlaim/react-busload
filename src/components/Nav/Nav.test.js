import {configure,shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Nav from './Nav';
import { Link } from 'react-router-dom'

configure({adapter: new Adapter()})

describe('test nav items', ()=>{
  it('should maybe have 2 links and a button if logged in and 3 links if logged out', ()=>{
  
    const wrapper = shallow(<Nav userDets/>)
    wrapper.setProps({userDets: { isUser: true } })
    expect(wrapper.find(Link)).toHaveLength(2);
  }) 
})


