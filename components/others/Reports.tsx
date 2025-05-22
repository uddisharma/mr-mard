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
import { Report } from "@prisma/client";

export default function ReportsList({ reports }: { reports: Report[] }) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex md:flex-row flex-col items-center justify-between space-y-0 pb-5">
        <CardTitle className="text-2xl font-bold ">My Reports</CardTitle>
        <Link href="/appointment-booking">
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
                <TableHead className="font-medium">Title</TableHead>
                <TableHead className="font-medium hidden md:table-cell">
                  Submitted At
                </TableHead>
                <TableHead className="font-medium hidden md:table-cell">
                  Status
                </TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {
                      //@ts-ignore
                      report?.questions[0]?.question
                    }
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(report.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="sucess">Completed</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="hidden md:flex items-center space-x-2">
                      <Link href={`/profile/my-reports/${report.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Report
                        </Button>
                      </Link>
                      {/* <Link href={`/profile/my-reports/${report.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Analysis
                        </Button>
                      </Link>
                      <Link href={`/profile/my-reports/${report.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </Link> */}
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
                            <Link href={`/profile/my-reports/${report.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Report
                              </Button>
                            </Link>
                            {/* <Link href={`/profile/my-reports/${report.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Analysis
                              </Button>
                            </Link>
                            <Link href={`/profile/my-reports/${report.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Export
                              </Button>
                            </Link> */}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
