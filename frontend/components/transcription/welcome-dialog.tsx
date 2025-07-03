import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeDialog({ isOpen, onClose }: WelcomeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90vw] md:max-w-[600px] lg:max-w-[800px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            Disclaimer
          </DialogTitle>
          <div className="hidden md:flex justify-center mb-6 overflow-hidden">
            <p className="text-center text-muted-foreground font-mono scale-75 lg:scale-100 origin-center">
              ⠀⠀⠀⠀⠀⠀⢐⢐⠔⠰⡐⠔⡐⢔⢐⠔⡐⢔⢐⠔⡐⢔⢐⠔⡰⡐⡌⡪⠰⠨⡘⡜⣔⡐⠔⡨⢘⢔⠐⢔⠐⠔⡑⢕⢕
              ⠀⠀⠀⠀⠀⠀⢪⠐⠌⡌⠔⠡⠨⡐⡐⢌⢐⠔⡐⢌⢢⠡⠢⢑⠢⢑⢐⠌⢌⢂⢂⢊⢆⠧⡑⡄⡑⠸⡨⡂⢅⢑⠨⠸⡰
              ⠀⠀⠀⠀⠀⠨⡸⡨⢈⢢⠡⠡⢑⠐⢌⢐⢐⠰⡘⢌⠢⠡⠡⡁⡊⠔⡐⢌⢂⢂⠢⡁⡢⢹⢸⢢⢊⠌⢜⢔⢐⠔⠡⢑⠸
              ⠀⠀⠀⠀⠀⡸⢸⡐⢅⢂⢇⠡⠡⣑⢑⠔⡡⢑⠌⡂⠅⠕⠡⢂⢊⢔⠨⡂⡕⡄⡑⡐⡐⡡⢣⢣⢣⠪⠠⢣⡑⠌⢌⠂⠕
              ⠀⠀⠀⠀⡄⡎⢎⠮⡢⠢⡊⡪⡑⡐⡱⡨⡂⠅⡂⡊⣌⠼⡘⡪⠑⢅⢕⢐⠄⠕⢕⢆⢕⢰⢡⠣⡣⡫⡊⠔⡕⢅⠢⠡⡑
              ⠀⠀⢀⠌⢨⢊⢎⢎⢎⠌⡢⢑⢜⢔⢔⠨⢊⠳⡜⡜⢤⢱⢐⢌⡊⡆⡢⡡⡣⡣⡣⡣⡣⡇⡇⡇⡇⡇⣇⢃⢇⠇⠌⡂⡊
              ⠀⠀⠀⡕⡕⡌⢎⢎⢖⢐⠋⢶⣄⠕⡱⡹⡰⡱⢨⢸⠰⢬⢨⢂⢃⢃⠣⢃⠣⠃⡃⠃⡃⣡⢅⠇⠣⡣⡣⡣⡱⡱⡁⠆⡊
              ⠀⠀⠀⠁⠀⡪⡪⡪⡓⠄⠂⠉⢹⡜⠐⠈⠎⢪⢒⢆⠭⣈⢌⡊⠕⡑⣊⣪⣦⣶⣶⣷⣿⣶⣶⣮⣊⣀⠉⡎⡎⡲⡨⢨⢂
              ⠀⠀⠀⠀⠀⡘⡆⢕⢝⠌⡀⢀⠀⠈⠠⠀⢀⠀⠀⠀⢀⠀⠀⢄⡦⣿⠟⣻⣻⢽⢽⢽⣫⣟⡿⡿⣿⣟⠏⢘⢜⢌⢆⠪⡂
              ⠀⠀⠀⠀⠀⠀⡣⡅⡣⡫⠀⠀⠀⠠⠀⠀⠀⢀⠠⠈⠀⠀⠐⡹⡚⡐⠄⠗⡉⡝⣅⣿⣦⢣⢹⢝⢷⡽⠀⠀⡇⡇⡕⡸⡨
              ⠀⠀⠀⠀⠀⠀⠐⢕⢌⢎⢎⠀⠈⢀⠀⠈⠀⠀⠀⠀⠀⠠⠀⠁⠀⠀⠀⢹⠸⢕⢆⢫⢱⢑⠝⡌⡼⠀⠀⡀⠸⡸⡘⠔⡕
              ⠀⠀⠀⠀⠀⠀⠀⢑⠕⡆⡓⡔⠀⣥⣦⡐⠀⠐⠀⠀⠁⠀⢀⠀⠁⠀⠀⠈⠊⢎⠜⡈⡐⡨⡨⠂⡃⢀⠁⠀⠈⡎⡪⡡⡓
              ⠀⠀⠀⠀⠀⠀⠀⠀⠪⡈⢎⢎⢇⡿⡸⣕⠀⠠⠐⠈⠀⠀⡀⠀⠀⠂⠀⡀⠠⠐⠐⠨⠈⡁⠄⢁⠀⠄⠀⠐⠀⡇⡇⡆⢕
              ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠱⡱⡱⠑⡅⠅⠀⠀⠀⢀⠀⠀⠀⠂⠀⠄⠀⠀⢀⠈⠀⠂⠠⠐⠀⡀⠂⠈⠀⠀⡪⡊⡆⡑
              ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠣⡪⡅⡈⠀⠂⠁⠀⠀⡀⠈⠀⠀⠄⠀⢀⠐⠀⠀⠁⠈⡀⠐⢀⠠⠀⠁⢀⠀⢕⢕⢱⠠
              ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢪⠸⡀⠈⠀⢀⠀⠁⠀⠀⠐⠀⠀⠠⠀⠀⠀⠀⠁⢀⠠⠐⠀⠀⠀⠄⠀⠀⡕⢕⠸⢘
              ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡕⣂⠀⠈⠀⠀⠀⠄⠂⠀⠐⠈⠀⠀⢀⠈⠀⠈⠀⠀⠀⠀⠀⠂⠀⠀⢂⢇⢇⢃⠰
              ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢐⢢⠀⠂⠀⠄⠀⠀⠠⠀⠀⡀⠄⠀⠀⠀⠂⠀⠠⠀⠂⠁⢀⠄⠅⡕⡕⠡⡂⢕
              ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠇⡪⡊⡆⠄⡀⠐⠈⠠⠐⠀⠀⠀⠀⠈⠀⢀⠐⢀⠠⢐⠠⠡⡐⡔⡕⠨⡊⠜⠀
              ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠕⡨⡊⡎⠀⠀⠈⠢⡢⢠⡈⡄⣀⢁⢄⢌⢔⢼⣫⡆⠀⠠⠁⡢⢃⠔⡡⢊⢠⣠
            </p>
          </div>
          <DialogDescription className="text-lg font-medium md:text-base text-center space-y-4">
            <span className="text-center list-none pl-6">
              <li>Transcribed texts are stored temporarily for up to 1 hour.</li>
              <li>Data is encrypted and secured during this period.</li>
              <li>Ensure sensitive information is not included in audio files.</li>
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
