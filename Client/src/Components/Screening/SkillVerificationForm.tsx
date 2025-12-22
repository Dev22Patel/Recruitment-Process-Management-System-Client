import { useState } from 'react';
import { Check, X, MessageSquare } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import type { CandidateSkillDto, SkillVerificationDto } from '@/Services/ScreeningService';

interface SkillVerificationFormProps {
  skills: CandidateSkillDto[];
  verifiedSkills: SkillVerificationDto[];
  onChange: (verifiedSkills: SkillVerificationDto[]) => void;
}

export const SkillVerificationForm = ({
  skills,
  verifiedSkills,
  onChange,
}: SkillVerificationFormProps) => {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const handleVerificationChange = (
    candidateSkillId: string,
    field: keyof SkillVerificationDto,
    value: any
  ) => {
    const existing = verifiedSkills.find((vs) => vs.candidateSkillId === candidateSkillId);

    if (existing) {
      onChange(
        verifiedSkills.map((vs) =>
          vs.candidateSkillId === candidateSkillId ? { ...vs, [field]: value } : vs
        )
      );
    } else {
      const skill = skills.find((s) => s.candidateSkillId === candidateSkillId);
      onChange([
        ...verifiedSkills,
        {
          candidateSkillId,
          skillName: skill?.skillName,
          claimedYears: skill?.yearsOfExperience,
          verifiedYears: skill?.yearsOfExperience,
          isVerified: field === 'isVerified' ? value : false,
          comments: field === 'comments' ? value : '',
        },
      ]);
    }
  };

  const getVerificationStatus = (candidateSkillId: string) => {
    return verifiedSkills.find((vs) => vs.candidateSkillId === candidateSkillId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Skill Verification</h3>
        <Badge variant="secondary">{skills.length} Skills</Badge>
      </div>

      {skills.map((skill) => {
        const verification = getVerificationStatus(skill.candidateSkillId);
        const isExpanded = expandedSkill === skill.candidateSkillId;

        return (
          <div
            key={skill.candidateSkillId}
            className="border rounded-lg p-4 space-y-3 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{skill.skillName}</h4>
                  {skill.isRequired && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {skill.yearsOfExperience} years
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={verification?.isVerified === true ? 'default' : 'outline'}
                  className={
                    verification?.isVerified === true ? 'bg-green-600 hover:bg-green-700' : ''
                  }
                  onClick={() =>
                    handleVerificationChange(skill.candidateSkillId, 'isVerified', true)
                  }
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={verification?.isVerified === false ? 'destructive' : 'outline'}
                  onClick={() =>
                    handleVerificationChange(skill.candidateSkillId, 'isVerified', false)
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setExpandedSkill(isExpanded ? null : skill.candidateSkillId)
                  }
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="space-y-3 pt-3 border-t">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Verified Years of Experience
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    value={verification?.verifiedYears || skill.yearsOfExperience || 0}
                    onChange={(e) =>
                      handleVerificationChange(
                        skill.candidateSkillId,
                        'verifiedYears',
                        parseFloat(e.target.value)
                      )
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Comments</label>
                  <Textarea
                    value={verification?.comments || ''}
                    onChange={(e) =>
                      handleVerificationChange(
                        skill.candidateSkillId,
                        'comments',
                        e.target.value
                      )
                    }
                    placeholder="Add notes about this skill verification..."
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};