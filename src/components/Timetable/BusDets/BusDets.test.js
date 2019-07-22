import {configure,shallow, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import BusDets from './BusDets';
import wetIcon from '../../../img/wet.svg';
import dryIcon from '../../../img/dry.svg';


configure({adapter: new Adapter()})

describe('<BusDets />', ()=>{
    let wrapper;
    let props = {
      busDets: {
        dry_snaps:[{_id:1,timetabled:'what',actual:'what',queryDateTime:'marie', queryScheduledTime:'what', weather:{precipIntensity:0}}],
        num_dry:0,
        num_total:1,
        num_wet:0,
        rtpi:false,
        time:'time',
        total_avg:1,
        wet_avg:null,
        wet_snaps:[{_id:5,timetabled:'what',actual:'what',queryDateTime:'marie', queryScheduledTime:'what', weather:{precipIntensity:0}}] 
      }
    }
 
    // beforeEach(()=>{
    //   wrapper = shallow(<BusDets />)
    // })

    it('should render a table', ()=>{
      wrapper = wrapper = shallow(<BusDets {...props} wetOrDry='dry' />)
      expect(wrapper.find('table')).toHaveLength(1);
    }) 

    it('should render a table', ()=>{
      wrapper = wrapper = shallow(<BusDets {...props} wetOrDry='wet' />)
      expect(wrapper.find('table')).toHaveLength(1);
    }) 

    it('should show wet icon', ()=>{
      wrapper = wrapper = shallow(<BusDets {...props} wetOrDry='wet' />)
      expect(wrapper.find("img").prop("src")).toEqual(wetIcon)
    }) 

    it('should show dry icon', ()=>{
      wrapper = wrapper = shallow(<BusDets {...props} wetOrDry='dry' />)
      expect(wrapper.find("img").prop("src")).toEqual(dryIcon)
    }) 
    it('should have num rows equal to snap length', ()=>{
      wrapper = wrapper = shallow(<BusDets {...props} wetOrDry='dry' />)
      expect(wrapper.find(".snaps")).toHaveLength(props.busDets.wet_snaps.length)
    }) 
 
})
