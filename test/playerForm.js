// jsdom because mocha
import {JSDOM} from 'jsdom'
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const {window} = jsdom;
global.window = window;
global.document = window.document;

import chai from 'chai'
import {expect} from 'chai'
import React from 'react'
import equalJSX from 'chai-equal-jsx'
// import {createRenderer} from 'react-addons-test-utils'
import { mount } from 'enzyme'
import PlayerForm from '../src/client/components/playerForm/playerForm'


// enzyme
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
configure({ adapter: new Adapter() });



chai.should()
chai.use(equalJSX)


describe('PlayerForm', function(){

	// let props;
	// let mountedPlayerForm;
	// function playerForm() {
	// 	console.log("playerForm test. props: ", props);
	//
	// 	if (!mountedPlayerForm) {
	// 		mountedPlayerForm = mount(
	// 			<PlayerForm {...props} />
	// 		);
	// 	}
	// 	return mountedPlayerForm;
	// }

	// beforeEach(() => {
	// 	props = {
	// 		onUpdateName: undefined
	// 	};
	// 	// mountedPlayerForm = undefined;
	// });

	it('always renders a div', function() {
		let props = {onUpdateName: undefined};
		let playerForm = mount(<PlayerForm {...props}/>);
		const divs = playerForm.find("div");
		expect(divs.length).equals(1);


		// const wrappingDiv = divs.first();
		// console.log(...wrappingDiv);
		// expect(wrappingDiv.children()).to.equal(playerForm.children());



			// 	const renderer = createRenderer()
	// 	renderer.render(<PlayerForm onUpdateName={undefined}/>)
	// 	const output = renderer.getRenderOutput()
	// 	let expectedElement = (
	// 		<div className={undefined}>
	// 			<input onKeyDown={function noRefCheck(){}} type="text" id="playerInputName" placeholder="Enter your username" />
	// 			<br/>
	// 			<input id="buttonPlayerInputName" value="Play" type="button" onClick={undefined} />
	// 		</div>
	// 	)
	// 	output.should.equalJSX(expectedElement);
	})

	it("contains everything else that gets rendered", function() {
		let props = {onUpdateName: undefined};
		let playerForm = mount(<PlayerForm {...props}/>);
		const divs = playerForm.find("div");
		const wrappingDiv = divs.first();
		expect(wrappingDiv).to.equal(playerForm);
	})
})


// <div className={styles.playerForm}>
// 	<input onKeyDown={keyboardEvent} type="text" id="playerInputName" placeholder="Enter your username" />
// 	<br/>
// 	<input id="buttonPlayerInputName" value="Play" type="button" onClick={props.onUpdateName} />
// </div>
