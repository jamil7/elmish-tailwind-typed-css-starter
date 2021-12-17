module App

open Elmish
open Elmish.React
open Feliz

type Model =
    {
        Count: int
    }
    static member init() = { Count = 0 }, Cmd.none

type Msg =
    | Increment
    | Decrement

let update (msg: Msg) (model: Model) : Model * Cmd<Msg> =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }, Cmd.none
    | Decrement -> { model with Count = model.Count - 1 }, Cmd.none

open Zanaptak.TypedCssClasses

type private Tw =
    CssClasses<"../public/style.css", Naming.Underscores, commandFile="node", argumentPrefix="../tailwind.process.js ../tailwind.config.js">

let view (state: Model) (dispatch: Msg -> unit) =
    Html.div [
        Html.button [
            prop.classes [ Tw.bg_blue_500 ]
            prop.onClick (fun _ -> dispatch Increment)
            prop.text "Increment"
        ]

        Html.button [
            prop.classes [ Tw.bg_red_500 ]
            prop.onClick (fun _ -> dispatch Decrement)
            prop.text "Decrement"
        ]

        Html.h1 state.Count
    ]


#if DEBUG
open Elmish.Debug
open Elmish.HMR
#endif

Program.mkProgram Model.init update view
#if DEBUG
|> Program.withConsoleTrace
|> Program.withDebugger
#endif
|> Program.withReactSynchronous "app"
|> Program.run
