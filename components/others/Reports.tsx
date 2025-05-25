"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle, FileText, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Analysis } from "@prisma/client";

export default function ReportsList({ analysis }: { analysis: Analysis[] }) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex md:flex-row flex-col items-center justify-between space-y-0 pb-5">
        <CardTitle className="text-2xl font-bold ">My Reports</CardTitle>
        <Link href="/analyze">
          <Button className="hidden md:flex bg-btnblue text-white" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Take Test Now
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium text-center">
                  Submitted At
                </TableHead>
                <TableHead className="font-medium text-center">Score</TableHead>
                <TableHead className="font-medium text-center">
                  Hair Count
                </TableHead>
                <TableHead className="font-medium text-center">
                  Hair Type
                </TableHead>
                <TableHead className="font-medium hidden md:table-cell">
                  Status
                </TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis?.map((report: any) => {
                const analysisData = report.analysis?.analysis;

                return (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium text-center">
                      {new Date(report.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {analysisData?.overall_score?.toFixed(0) || 50}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {analysisData?.estimated_hair_count || 50000}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {analysisData?.hair_type || "Unknown"}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Badge variant="sucess">Completed</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="hidden md:flex items-center space-x-2">
                        <Link href={`/report/${report.id}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View Report
                          </Button>
                        </Link>
                      </div>
                      <div className="md:hidden">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 mr-10">
                            <div className="flex flex-col space-y-2">
                              <Link href={`/report/${report.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Report
                                </Button>
                              </Link>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
