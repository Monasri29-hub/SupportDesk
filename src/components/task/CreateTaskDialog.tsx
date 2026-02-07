import { useState } from 'react';
import { useTaskManager } from '@/contexts/TaskManagerContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

export default function CreateTaskDialog() {
  const { addTask } = useTaskManager();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [boundaryValue, setBoundaryValue] = useState('24');
  const [boundaryUnit, setBoundaryUnit] = useState<'hours' | 'days'>('hours');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    const warningBoundaryHours =
      boundaryUnit === 'days' ? parseInt(boundaryValue) * 24 : parseInt(boundaryValue);

    addTask({
      title: title.trim(),
      description: description.trim(),
      deadline: new Date(deadline).toISOString(),
      warningBoundaryHours,
    });

    setTitle('');
    setDescription('');
    setDeadline('');
    setBoundaryValue('24');
    setBoundaryUnit('hours');
    setOpen(false);
  }

  // Set min datetime to now
  const now = new Date();
  const minDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl shadow-md">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={minDatetime}
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Warning Boundary</Label>
            <p className="text-xs text-muted-foreground">
              Get reminded this long before the deadline
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max="999"
                value={boundaryValue}
                onChange={(e) => setBoundaryValue(e.target.value)}
                className="w-24 rounded-xl"
              />
              <Select value={boundaryUnit} onValueChange={(v) => setBoundaryUnit(v as 'hours' | 'days')}>
                <SelectTrigger className="w-28 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-xl">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded-xl">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
