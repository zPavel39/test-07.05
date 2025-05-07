import React, { useRef } from 'react'
import './App.css'

interface Param {
	id: number
	name: string
	type?: 'string'
}

interface ParamValue {
	paramId: number
	value: string
}

interface Color {
	name: string
	hex: string
}

interface Model {
	paramValue: ParamValue[]
	colors: Color[]
}

interface Props {
	params: Param[]
	model: Model
}

interface State {
	values: Record<number, string>
}

class ParamEditor extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)

		const initialValues: Record<number, string> = {}
		props.params.forEach(param => {
			const existingValue = props.model.paramValue.find(
				pv => pv.paramId === param.id
			)
			initialValues[param.id] = existingValue ? existingValue.value : ''
		})

		this.state = {
			values: initialValues,
		}
	}

	// обработка изменений
	handleChange = (paramId: number, value: string) => {
		this.setState(prevState => ({
			values: {
				...prevState.values,
				[paramId]: value,
			},
		}))
	}

	// получение структуры Model
	getModel(): Model {
		const paramValue: ParamValue[] = Object.entries(this.state.values).map(
			([paramId, value]) => ({
				paramId: Number(paramId),
				value,
			})
		)

		return {
			paramValue,
			colors: this.props.model.colors || [],
		}
	}

	// рендер полей
	renderInput(param: Param) {
		switch (param.type) {
			case 'string':
			default:
				return (
					<input
						type='text'
						value={this.state.values[param.id] || ''}
						onChange={e => this.handleChange(param.id, e.target.value)}
						style={{ width: '100%', padding: '4px' }}
					/>
				)
		}
	}

	render() {
		return (
			<div>
				<form>
					{this.props.params.map(param => (
						<div key={param.id} style={{ marginBottom: '10px' }}>
							<label>
								{param.name}
								<div>{this.renderInput(param)}</div>
							</label>
						</div>
					))}
				</form>
			</div>
		)
	}
}

function App() {
	const editorRef = useRef<ParamEditor>(null)

	const params = [
		{ id: 1, name: 'Назначение' },
		{ id: 2, name: 'Длина' },
	]

	const model = {
		paramValue: [
			{ paramId: 1, value: 'повседневное' },
			{ paramId: 2, value: 'макси' },
		],
		colors: [],
	}

	const handleSave = () => {
		if (editorRef.current) {
			const result = editorRef.current.getModel()
			console.log('Model:', result)
			console.log('Model2:', editorRef.current.getModel())
		}
	}

	return (
		<div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '50px' }}>
			<ParamEditor ref={editorRef} params={params} model={model} />
			<button onClick={handleSave}>Сохранить</button>
		</div>
	)
}

export default App
