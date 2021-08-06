module App

open Elmish
open Elmish.React
open Feliz

type State = { Count: int }

type Msg =
    | Increment
    | Decrement

let init () = { Count = 0 }, Cmd.none

let update (msg: Msg) (state: State) : State * Cmd<Msg> =
    match msg with
    | Increment -> { state with Count = state.Count + 1 }, Cmd.none

    | Decrement -> { state with Count = state.Count - 1 }, Cmd.none

open Zanaptak.TypedCssClasses

type private tw =
    CssClasses<"../public/style.css", Naming.Verbatim, commandFile="node", argumentPrefix="../tailwind.process.js ../tailwind.config.js"
    //, logFile = "TypedCssClasses.log" // uncomment to enable logging
    >

let render (state: State) (dispatch: Msg -> unit) =
    Html.div [
        Html.button [
            prop.classes [ tw.``bg-blue-500`` ]
            prop.onClick (fun _ -> dispatch Increment)
            prop.text "Increment"
        ]

        Html.button [
            prop.classes [ tw.``bg-red-500`` ]
            prop.onClick (fun _ -> dispatch Decrement)
            prop.text "Decrement"
        ]

        Html.h1 state.Count
    ]


#if DEBUG
open Elmish.Debug
open Elmish.HMR
#endif

Program.mkProgram init update render
#if DEBUG
|> Program.withConsoleTrace
#endif
|> Program.withReactSynchronous "app"
#if DEBUG
|> Program.withDebugger
#endif
|> Program.run
