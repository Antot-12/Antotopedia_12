"use client";

import ColorMenu from "./color/ColorMenu";

type Props = {
    onH2Action: () => void;
    onH3Action: () => void;
    onBoldAction: () => void;
    onItalicAction: () => void;
    onStrikeAction: () => void;
    onCodeInlineAction: () => void;
    onCodeBlockAction: () => void;
    onQuoteAction: () => void;
    onListAction: () => void;
    onLinkAction: () => void;
    onImageAction: () => void;
    onTableAction: () => void;
    onPickAction: (hex: string) => void;
    onClearAction: () => void;
    onBeforeColorOpenAction?: () => void;
};

export default function Toolbar(props: Props) {
    return (
        <div className="card p-2">
            <div className="toolbar">
                <button className="btn btn-soft px-3 py-1" onClick={props.onH2Action}>H2</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onH3Action}>H3</button>
                <span className="mx-1 w-px h-6 bg-white/10" />
                <button className="btn btn-soft px-3 py-1" onClick={props.onBoldAction}>Bold</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onItalicAction}>Italic</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onStrikeAction}>Strike</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onCodeInlineAction}>Code</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onCodeBlockAction}>Code block</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onQuoteAction}>Quote</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onListAction}>List</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onLinkAction}>Link</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onImageAction}>Image</button>
                <button className="btn btn-soft px-3 py-1" onClick={props.onTableAction}>Table</button>

                <ColorMenu
                    onPickAction={props.onPickAction}
                    onClearAction={props.onClearAction}
                    onBeforeColorOpenAction={props.onBeforeColorOpenAction}
                />
            </div>
        </div>
    );
}