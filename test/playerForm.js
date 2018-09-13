import chai from "chai"
import React from 'react'
import equalJSX from 'chai-equal-jsx'
import {createRenderer} from 'react-addons-test-utils'
import PlayerForm from '../src/client/components/playerForm/playerForm'

chai.should()
chai.use(equalJSX)

describe('PlayerForm Test #1', function(){
	// it('JSX Test', function(){
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
	// })


	// it('Keyboard event', function() {
	// 	const onKeyDown = sinon.spy();
	// 	const wrapper = mount(<PlayerForm onKeyDown={onKeyDown}/>);
	// 	const input = wrapper.find('input');
	// 	input.simulate('keyDown', {keyCode: 40});
	// 	expect(onKeyDown.called).to.be.true;
	// })
})


// <div className={styles.playerForm}>
// 	<input onKeyDown={keyboardEvent} type="text" id="playerInputName" placeholder="Enter your username" />
// 	<br/>
// 	<input id="buttonPlayerInputName" value="Play" type="button" onClick={props.onUpdateName} />
// </div>
