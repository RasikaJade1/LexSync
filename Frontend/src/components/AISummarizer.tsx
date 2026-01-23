import React from "react";
import {
  Upload,
  Brain,
  FileText,
  Image,
  Download,
  Copy,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Zap,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";

const mockDocuments = [
  {
    id: "DOC-AI-001",
    name: "Medical_Report_Comprehensive.pdf",
    type: "pdf",
    size: "3.2 MB",
    uploadDate: "2024-01-12",
    status: "processed",
    processingTime: "2.3 seconds",
    extractedText: `MEDICAL EXAMINATION REPORT

Patient: Michael Smith
Date of Examination: January 8, 2024
Physician: Dr. Sarah Wilson, MD

CHIEF COMPLAINT:
Patient reports severe lower back pain following workplace injury on December 15, 2023.

HISTORY OF PRESENT ILLNESS:
Mr. Smith is a 34-year-old construction worker who sustained an injury while lifting heavy equipment at his workplace. He reports immediate onset of sharp, stabbing pain in his lower back radiating down his left leg. Pain is rated 8/10 on the pain scale and worsens with movement.

PHYSICAL EXAMINATION:
- Blood pressure: 128/82 mmHg
- Heart rate: 78 bpm
- Temperature: 98.6°F
- Musculoskeletal: Limited range of motion in lumbar spine, positive straight leg raise test on left side
- Neurological: Decreased sensation in L5 distribution

DIAGNOSTIC FINDINGS:
MRI of lumbar spine reveals herniated disc at L4-L5 level with nerve root compression.

DIAGNOSIS:
Lumbar disc herniation with radiculopathy

TREATMENT RECOMMENDATIONS:
1. Physical therapy 3x per week for 6 weeks
2. Anti-inflammatory medication as prescribed
3. Work restrictions: No lifting >20 pounds
4. Follow-up in 4 weeks

PROGNOSIS:
Good with conservative treatment. Expected return to full activity in 8-12 weeks.`,
    summary: {
      keyPoints: [
        "Patient: Michael Smith, 34-year-old construction worker",
        "Workplace injury on December 15, 2023 - lifting heavy equipment",
        "Diagnosed with lumbar disc herniation at L4-L5 with radiculopathy",
        "Pain level: 8/10, radiating to left leg",
        "MRI shows herniated disc with nerve compression",
        "Treatment: Physical therapy, medication, work restrictions",
        "No lifting over 20 pounds restriction",
        "Good prognosis with 8-12 week recovery timeline",
      ],
      medicalFindings: [
        "Herniated disc at L4-L5 level",
        "Nerve root compression",
        "Limited lumbar spine range of motion",
        "Positive straight leg raise test",
        "Decreased L5 sensation",
      ],
      recommendations: [
        "Physical therapy 3x weekly for 6 weeks",
        "Anti-inflammatory medication",
        "Work restrictions (no lifting >20 lbs)",
        "Follow-up appointment in 4 weeks",
      ],
      legalRelevance: [
        "Work-related injury with clear causation",
        "Objective medical findings support claim",
        "Documented functional limitations",
        "Clear treatment plan and prognosis",
        "Temporary disability with expected recovery",
      ],
    },
  },
  {
    id: "DOC-AI-002",
    name: "Contract_Amendment_Draft.pdf",
    type: "pdf",
    size: "1.8 MB",
    uploadDate: "2024-01-10",
    status: "processing",
    processingTime: null,
    progress: 65,
  },
  {
    id: "DOC-AI-003",
    name: "Witness_Photo_Evidence.jpg",
    type: "jpg",
    size: "5.1 MB",
    uploadDate: "2024-01-08",
    status: "processed",
    processingTime: "1.8 seconds",
    extractedText:
      "Image analysis shows construction site with visible safety hazards including unsecured equipment, inadequate lighting, and wet surfaces. Timestamp indicates photo was taken at 3:47 PM on December 15, 2023.",
    summary: {
      keyPoints: [
        "Construction site photograph from December 15, 2023",
        "Timestamp: 3:47 PM (around time of incident)",
        "Multiple safety hazards visible",
        "Unsecured heavy equipment present",
        "Poor lighting conditions documented",
        "Wet surfaces creating slip hazards",
      ],
      visualElements: [
        "Heavy construction equipment (crane, bulldozer)",
        "Wet concrete surfaces",
        "Inadequate warning signs",
        "Poor lighting setup",
        "Workers without proper safety gear",
      ],
      legalRelevance: [
        "Documents site conditions at time of incident",
        "Shows potential OSHA violations",
        "Evidence of employer negligence",
        "Supports unsafe workplace claims",
        "Corroborates witness testimony about conditions",
      ],
    },
  },
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case "processed":
      return {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Processed",
      };
    case "processing":
      return {
        color: "bg-blue-100 text-blue-800",
        icon: Loader2,
        label: "Processing",
      };
    case "failed":
      return {
        color: "bg-red-100 text-red-800",
        icon: AlertTriangle,
        label: "Failed",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        icon: FileText,
        label: "Pending",
      };
  }
};

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return { icon: FileText, color: "text-red-600" };
    case "jpg":
    case "jpeg":
    case "png":
      return { icon: Image, color: "text-purple-600" };
    default:
      return { icon: FileText, color: "text-gray-600" };
  }
};

export function AISummarizer() {
  const [selectedDocument, setSelectedDocument] =
    React.useState<(typeof mockDocuments)[0] | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [copiedText, setCopiedText] = React.useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload here
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const stats = {
    totalProcessed: mockDocuments.filter(
      (d) => d.status === "processed",
    ).length,
    processing: mockDocuments.filter(
      (d) => d.status === "processing",
    ).length,
    totalTime: mockDocuments
      .filter((d) => d.processingTime)
      .reduce(
        (sum, d) =>
          sum +
          parseFloat(d.processingTime?.split(" ")[0] || "0"),
        0,
      ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            AI Document Summarizer
          </h1>
          <p className="text-gray-600">
            Upload documents for AI-powered analysis and
            summarization
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-700"
          >
            <Zap className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Documents Processed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalProcessed}
                </p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Currently Processing
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.processing}
                </p>
              </div>
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Processing Time
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalTime.toFixed(1)}s
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Brain className="mx-auto h-12 w-12 text-purple-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop files here for AI analysis
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Supports PDF, DOC, DOCX, JPG, PNG up to 10MB
              </p>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>

            <Alert className="mt-4">
              <Brain className="h-4 w-4" />
              <AlertDescription>
                AI will extract text, identify key information,
                and generate summaries with legal relevance
                analysis.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDocuments.map((doc) => {
                const statusInfo = getStatusInfo(doc.status);
                const StatusIcon = statusInfo.icon;
                const { icon: FileIcon, color } = getFileIcon(
                  doc.type,
                );

                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex items-center space-x-3">
                      <FileIcon
                        className={`h-6 w-6 ${color}`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {doc.name}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                        </div>
                        {doc.status === "processing" &&
                          doc.progress && (
                            <Progress
                              value={doc.progress}
                              className="w-full mt-2"
                            />
                          )}
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                    >
                      <StatusIcon
                        className={`w-3 h-3 mr-1 ${doc.status === "processing" ? "animate-spin" : ""}`}
                      />
                      {statusInfo.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Analysis Modal */}
      {selectedDocument && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI Analysis: {selectedDocument.name}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {selectedDocument.processingTime && (
                <Badge variant="secondary">
                  Processed in {selectedDocument.processingTime}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDocument(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDocument.status === "processing" ? (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Processing Document
                </h3>
                <p className="text-gray-600 mb-4">
                  AI is analyzing the document content...
                </p>
                {selectedDocument.progress && (
                  <div className="max-w-md mx-auto">
                    <Progress
                      value={selectedDocument.progress}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedDocument.progress}% complete
                    </p>
                  </div>
                )}
              </div>
            ) : selectedDocument.status === "processed" ? (
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">
                    AI Summary
                  </TabsTrigger>
                  <TabsTrigger value="extracted">
                    Extracted Text
                  </TabsTrigger>
                  <TabsTrigger value="legal">
                    Legal Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="summary"
                  className="space-y-6"
                >
                  {selectedDocument.summary && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-3">
                          Key Points
                        </h4>
                        <ul className="space-y-1">
                          {selectedDocument.summary.keyPoints.map(
                            (point, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2 text-sm text-green-800"
                              >
                                <span className="text-green-600 mt-1">
                                  •
                                </span>
                                <span>{point}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      {selectedDocument.summary
                        .medicalFindings && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-3">
                            Medical Findings
                          </h4>
                          <ul className="space-y-1">
                            {selectedDocument.summary.medicalFindings.map(
                              (finding, index) => (
                                <li
                                  key={index}
                                  className="flex items-start space-x-2 text-sm text-blue-800"
                                >
                                  <span className="text-blue-600 mt-1">
                                    •
                                  </span>
                                  <span>{finding}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {selectedDocument.summary
                        .visualElements && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-medium text-purple-900 mb-3">
                            Visual Elements
                          </h4>
                          <ul className="space-y-1">
                            {selectedDocument.summary.visualElements.map(
                              (element, index) => (
                                <li
                                  key={index}
                                  className="flex items-start space-x-2 text-sm text-purple-800"
                                >
                                  <span className="text-purple-600 mt-1">
                                    •
                                  </span>
                                  <span>{element}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(
                              selectedDocument.summary?.keyPoints.join(
                                "\n",
                              ) || "",
                            )
                          }
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          {copiedText
                            ? "Copied!"
                            : "Copy Summary"}
                        </Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Download Report
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="extracted"
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">
                      Extracted Text
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          selectedDocument.extractedText || "",
                        )
                      }
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copiedText ===
                      selectedDocument.extractedText
                        ? "Copied!"
                        : "Copy Text"}
                    </Button>
                  </div>
                  <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-gray-50">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedDocument.extractedText}
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent
                  value="legal"
                  className="space-y-4"
                >
                  {selectedDocument.summary?.legalRelevance && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-medium text-amber-900 mb-3">
                        Legal Relevance Analysis
                      </h4>
                      <ul className="space-y-2">
                        {selectedDocument.summary.legalRelevance.map(
                          (item, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2 text-sm text-amber-800"
                            >
                              <span className="text-amber-600 mt-1">
                                ⚖️
                              </span>
                              <span>{item}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      AI analysis is for reference only. Always
                      consult with legal professionals for case
                      strategy decisions.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Processing Failed
                </h3>
                <p className="text-gray-600">
                  Unable to process this document. Please try
                  again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}