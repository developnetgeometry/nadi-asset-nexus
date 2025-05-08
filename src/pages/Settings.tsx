
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings, categories, statuses, and access controls
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="categories">Asset Categories</TabsTrigger>
          <TabsTrigger value="sla">SLA Settings</TabsTrigger>
          <TabsTrigger value="users">Users & Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                View and update system information settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" value="NADI e-System" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-version">System Version</Label>
                  <Input id="system-version" value="1.0.0" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Organization Name</Label>
                  <Input id="organization-name" value="Malaysian Communications and Multimedia Commission" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" value="support@example.com" />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sla-breach">SLA Breach Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send alerts when SLA is close to being breached
                    </p>
                  </div>
                  <Switch id="sla-breach" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-reminders">Maintenance Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders for scheduled maintenance
                    </p>
                  </div>
                  <Switch id="maintenance-reminders" defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Categories</CardTitle>
              <CardDescription>
                Manage asset categories and types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Categories content would go here */}
                <p className="text-muted-foreground">Configure asset categories, types, and classification here.</p>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Categories configuration interface to be implemented</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sla" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SLA Settings</CardTitle>
              <CardDescription>
                Configure SLA timing rules and notification thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* SLA settings content would go here */}
                <p className="text-muted-foreground">Define SLA timeframes for different categories and priorities.</p>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">SLA configuration interface to be implemented</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users & Access Control</CardTitle>
              <CardDescription>
                Manage users, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* User management content would go here */}
                <p className="text-muted-foreground">Configure user access, roles, and permissions here.</p>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">User management interface to be implemented</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
