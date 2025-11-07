import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Download, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Reports() {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".docx")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .docx file",
        variant: "destructive",
      });
      return;
    }
    setUploadedFile(file);
    toast({
      title: "File uploaded",
      description: file.name,
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Generating report",
      description: "This feature will be available soon",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2" data-testid="text-reports-title">
        Compliance Reports
      </h1>
      <p className="text-muted-foreground mb-8">
        Generate ESG and compliance reports with your custom templates
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Built-in Template */}
        <Card className="p-6 hover-elevate transition-all">
          <FileText className="h-10 w-10 text-primary mb-4" />
          <h2 className="text-lg font-semibold mb-2">Built-in ESG Template</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Standard ESG report template with pre-configured metrics and compliance sections
          </p>
          <Button variant="outline" className="w-full" data-testid="button-use-builtin">
            <Download className="h-4 w-4 mr-2" />
            Use Built-in Template
          </Button>
        </Card>

        {/* Custom Template Upload */}
        <Card className="p-6">
          <Upload className="h-10 w-10 text-primary mb-4" />
          <h2 className="text-lg font-semibold mb-2">Custom Template</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your own DOCX template with placeholders for automatic data population
          </p>
          <form
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="relative"
          >
            <Input
              type="file"
              accept=".docx"
              onChange={handleChange}
              className="hidden"
              id="file-upload"
              data-testid="input-file"
            />
            <Label
              htmlFor="file-upload"
              className={cn(
                "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary hover:bg-muted/50"
              )}
              data-testid="dropzone"
            >
              {uploadedFile ? (
                <div className="text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">Click to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drop DOCX file or click to browse
                  </p>
                </div>
              )}
            </Label>
          </form>
        </Card>
      </div>

      {/* Field Mapping Section */}
      {uploadedFile && (
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Field Mapping</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Map placeholders in your template to available metrics
          </p>
          <div className="space-y-3">
            {["{{COMPANY_NAME}}", "{{TOTAL_COST}}", "{{CARBON_EMISSIONS}}", "{{CII_SCORE}}"].map((placeholder) => (
              <div key={placeholder} className="flex items-center gap-4 p-3 rounded-lg border">
                <code className="flex-1 text-sm font-mono">{placeholder}</code>
                <select className="px-3 py-1 rounded border bg-background text-sm">
                  <option>Select metric...</option>
                  <option>Company Name</option>
                  <option>Total Cost (USD)</option>
                  <option>Carbon Emissions (tons)</option>
                  <option>CII Score</option>
                </select>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Generate Button */}
      {uploadedFile && (
        <div className="flex justify-center">
          <Button size="lg" onClick={handleGenerateReport} data-testid="button-generate-report">
            <FileText className="h-5 w-5 mr-2" />
            Generate Report
          </Button>
        </div>
      )}

      {/* Version History */}
      <Card className="p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Reports
        </h2>
        <div className="space-y-3">
          {[
            { id: "1", name: "ESG Report Q4 2024.docx", date: "2024-12-15T10:30:00Z" },
            { id: "2", name: "Sustainability Report 2024.docx", date: "2024-11-20T14:15:00Z" },
            { id: "3", name: "Carbon Disclosure Report.docx", date: "2024-10-05T09:00:00Z" },
          ].map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg border hover-elevate transition-all"
              data-testid={`report-${report.id}`}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{report.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(report.date).toLocaleString()}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
