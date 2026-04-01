"use client";

import { useState } from "react";
import MermaidPreview from "./MermaidPreview";

const DIAGRAM_EXAMPLES = {
    flowchart: `graph TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Do Something]
    B -->|No| D[Do Something Else]
    C --> E[End]
    D --> E`,

    sequence: `sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Click Button
    Frontend->>Backend: API Request
    Backend->>Database: Query Data
    Database-->>Backend: Return Results
    Backend-->>Frontend: JSON Response
    Frontend-->>User: Update UI`,

    gantt: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements     :done, req, 2024-01-01, 7d
    Design          :active, des, 2024-01-08, 7d
    section Development
    Frontend        :dev1, 2024-01-15, 14d
    Backend         :dev2, 2024-01-15, 14d
    section Testing
    QA Testing      :test, 2024-01-29, 7d
    section Launch
    Deploy          :launch, 2024-02-05, 2d`,

    pie: `pie title Technology Stack
    "React" : 35
    "Next.js" : 25
    "TypeScript" : 20
    "Tailwind" : 15
    "Other" : 5`,

    er: `erDiagram
    USER ||--o{ POST : creates
    USER {
        int id PK
        string name
        string email
    }
    POST {
        int id PK
        string title
        string content
        int userId FK
    }
    POST ||--o{ COMMENT : has
    COMMENT {
        int id PK
        string text
        int postId FK
    }`,

    class: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
};

export default function MermaidInserter({ onInsert }: { onInsert: (code: string) => void }) {
    const [selectedType, setSelectedType] = useState<keyof typeof DIAGRAM_EXAMPLES>("flowchart");
    const [customCode, setCustomCode] = useState(DIAGRAM_EXAMPLES.flowchart);
    const [showPreview, setShowPreview] = useState(false);

    const handleInsert = () => {
        onInsert(`\`\`\`mermaid\n${customCode}\n\`\`\``);
    };

    const handleTypeChange = (type: keyof typeof DIAGRAM_EXAMPLES) => {
        setSelectedType(type);
        setCustomCode(DIAGRAM_EXAMPLES[type]);
    };

    return (
        <div className="card p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">📊 Insert Mermaid Diagram</h3>
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs btn btn-soft"
                >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
            </div>

            {/* Diagram Type Selector */}
            <div>
                <label className="text-sm text-white/70 mb-2 block">Diagram Type:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {Object.keys(DIAGRAM_EXAMPLES).map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type as keyof typeof DIAGRAM_EXAMPLES)}
                            className={`text-xs px-3 py-2 rounded-lg capitalize transition ${selectedType === type
                                    ? "bg-accent/20 border-accent text-accent border"
                                    : "bg-white/5 border border-white/10 hover:border-accent/50"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Code Editor */}
            <div>
                <label className="text-sm text-white/70 mb-2 block">Mermaid Code:</label>
                <textarea
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="input font-mono text-sm min-h-[200px] resize-y"
                    placeholder="Enter Mermaid diagram code..."
                />
            </div>

            {/* Live Preview */}
            {showPreview && (
                <div>
                    <label className="text-sm text-white/70 mb-2 block">Preview:</label>
                    <MermaidPreview code={customCode} />
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end">
                <button onClick={handleInsert} className="btn btn-primary">
                    ✓ Insert Diagram
                </button>
            </div>

            {/* Help Text */}
            <div className="text-xs text-white/60 space-y-1">
                <p>
                    <strong>Tip:</strong> Use <code className="text-accent">```mermaid</code> code blocks in your
                    markdown to render diagrams.
                </p>
                <p>
                    Learn more:{" "}
                    <a
                        href="https://mermaid.js.org/intro/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                    >
                        Mermaid Documentation
                    </a>
                </p>
            </div>
        </div>
    );
}
