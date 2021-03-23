import React, {useState} from 'react'
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse;

function RadioBox(props) {

    const [Value, setValue] = useState(0)


    const renderRadioBox = () => (
        props.list && props.list.map(value => (
            // 키 값으로 index를 줘도 되지만 이번에는 색다르게 _id 값을 주기로 함(결과는 인덱스랑 같음)
            <Radio key={value._id} value={value._id}> {value.name} </Radio>
        ))
    )

    const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="Price" key="1">

                    <Radio.Group onChange={handleChange} value={Value}>
                        {renderRadioBox()}
                    </Radio.Group>

                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
