import {configure,shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Spinner from './Spinner';


configure({adapter: new Adapter()})

describe('<Spinner />', ()=>{
  it('should render a spinner', ()=>{
  
    const wrapper = shallow(<Spinner />)
 
    expect(wrapper.find('div')).toHaveLength(1);
  }) 
})
