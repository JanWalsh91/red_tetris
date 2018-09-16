
import React from 'react'
import { expect, assert } from 'chai'
import sinon from 'sinon'

// configure enzyme:
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15.4';
configure({ adapter: new Adapter() });

// components:
import App from '../src/client/containers/app/app'
import Main from '../src/client/containers/app/main/main'
import Headerbar from '../src/client/components/headerBar/headerBar'
import Button from '../src/client/components/button/button'
import EndGameLeaderBoard from '../src/client/components/endGameLeaderBoard/endGameLeaderBoard'
import HostList from '../src/client/components/hostList/hostList'

import {createMockStore} from 'redux-test-utils'

describe('app container', function () {
	let wrapper = null;
	let props = {};

	const mountWithStore = (component, store) => {
		const context = {
			store,
		};
		return mount(component, { context });
	};

	it('should contain <div>ERROR: </div>', function () {
		const state = {
	      errorMessage: "Fatal Error"
	    };
	    const store = createMockStore(state)
	    const component = mountWithStore(<App />, store);
	    expect(component).to.be.a('object');
		expect(component.find('span').html()).to.include(state.errorMessage);
	});

	it('should contain Header bar and Main', function () {
		const state = {

	    };
	    const store = createMockStore(state)
	    const component = mountWithStore(<App />, store);

		expect(component).to.be.a('object');
		expect(component.find('h1').html()).to.include('RED TETRIS');
	});

	// it('should respond to click event', function() {
	// 	const state = {
	// 		gameJoined: false
	//     };
	// 	const onKeyPress = sinon.spy(document, 'addEventListener');
	//     const store = createMockStore(state)
	//     const component = mountWithStore(<App />, store);
	//
	// 	component.find('h1').simulate('keyDown', {keyCode: 13});
	// 	expect(onKeyPress).to.have.property('callCount').gt(0)
	// })

	// it('should respond to key event in game', function() {
	// 	const state = {
	// 		gameJoined: true
	//     };
	// 	const store = createMockStore(state)
	// 	console.log(document);
	// 	const onKeyPress = sinon.spy(document.onkeydown, 'keydown');
	//     const component = mountWithStore(<App />, store);
	//
	// 	// console.log(onKeyPress);
	// 	component.find(Main).simulate('keydown');
	// 	console.log(onKeyPress);
	// 	expect(onKeyPress).to.have.property('callCount', 1);
	// })



});

describe('main container', function () {
	let wrapper = null;
	let props = {};

	const mountWithStore = (component, store) => {
		const context = {
			store,
		};
		return mount(component, { context });
	};

	const shallowWithStore = (component, store) => {
		const context = {
			store,
		};
		return shallow(component, { context });
	};

	it('should contain LeaderBoard', function () {
		const state = {};
	    const store = createMockStore(state)
	    const component = mountWithStore(<Main />, store);
	    expect(component).to.be.a('object');
		expect(component.find('h3').html()).to.include('Leader Board');
	});

	it('should contain Button(s)', function () {
		const state = {
			playerName: "playerName"
	    };
	    const store = createMockStore(state)
	    const component = mountWithStore(<Main />, store);

		expect(component).to.be.a('object');
		expect(!!component.find(Button)).be.true;
		// expect(component).;
	});

	it('should contain Host Interface', function () {
		const state = {
			playerName: "playerName",
			isHost: true,
			gameStart: false,
			gameJoined: true
	    };
	    const store = createMockStore(state)
	    const component = mountWithStore(<Main />, store);

		expect(component).to.be.a('object');
		expect(component.exists('#invisibleMode')).be.true;
	});

	it('should contain end Game Leader Board', function () {
		const state = {
			playerName: "playerName",
			isHost: true,
			gameStart: false,
			gameJoined: true,
			endGame: true
	    };
	    const store = createMockStore(state)
	    const component = mountWithStore(<Main />, store);

		expect(component).to.be.a('object');
		expect(component.contains(EndGameLeaderBoard)).be.true;
	});


	it('should contain end Game Leader Board', function () {
		const state = {
			playerName: "playerName",
			gameStart: false,
			gameJoined: false,
			hostList: [
				{
					id: 1,
					hostName: 'hostName',
					playerCount: 2
				}
			]
		};
		const store = createMockStore(state)
		const component = mountWithStore(<Main />, store);

		expect(component).to.be.a('object');
		expect(component.contains(HostList)).be.true;
	});

	// TODO: fuc**** fct startGame, quitGame, updateName
	// it('should click on start Game', function() {
	// 	const state = {
	// 		playerName: "playerName",
	// 		isHost: true,
	// 		gameStart: false,
	// 		gameJoined: true
	// 	};
	// 	const store = createMockStore(state)
	//     const component = mountWithStore(<Main />, store);
	// 	const onClick = sinon.spy();
	//
	// 	console.log(component.html());
	// 	console.log("===");
	// 	// console.log(component.find('input[type="button"]').hostNodes());
	// 	// console.log(component.find('input[type="button"]').get(0));
	//
	// 	// component.find(Button).forEach( (node) => {
	// 	// 	node.simulate('click');
	// 	// 	console.log("loop");
	// 	// })
	//
	// 	expect(component.find('input')).to.have.lengthOf(3);
	//
	// 	component.find('input').at(0).simulate('click');
	// 	// component.find('#invisibleMode').simulate('click');
	// 	// console.log(onClick);
	// 	expect(onClick).to.have.property('callCount', 1);
	//
	// })

});
