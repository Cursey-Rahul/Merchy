
import Featured from "@/components/Featured";
import Offer from "@/components/Offer";
import Slider from "@/components/Slider";
import Toss3d from "@/components/Toss3D";
export const dynamic = 'force-dynamic';



export default function Home() {
  return (
    <main>
      <Toss3d/>
      <Slider/>
      <Featured/>
      <Offer/>
    </main>
  )
}