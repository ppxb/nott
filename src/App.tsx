import NottEditor from './components/editor'

function App() {
	// async function greet() {
	//   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
	//   setGreetMsg(await invoke('greet', { name }))
	// }

	return (
		<div className="w-dvw h-dvh flex">
			<div className="w-18 bg-amber-200 shrink-0">sidebar</div>
			<div className="w-100 bg-amber-600 shrink-0">
				<h1 className="text-2xl font-bold animate-bounce">halo</h1>
			</div>
			<div className="flex-1 min-w-0">
				<NottEditor />
			</div>
		</div>
	)
}

export default App
